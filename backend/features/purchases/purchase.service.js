const Purchase = require('./purchase.model');
const PurchaseItem = require('./purchaseItem.model');
const stockService = require('../stock/stock.service');
const supplierService = require('../suppliers/supplier.service');
const { paginateQuery } = require('../../utils/paginateQuery');

const purchaseService = {
  async getPurchases(orgId, reqQuery) {
    const filter = { orgId };
    if (reqQuery.status) filter.status = reqQuery.status;
    if (reqQuery.supplierId) filter.supplierId = reqQuery.supplierId;

    const query = Purchase.find(filter);
    return await paginateQuery(query, reqQuery);
  },

  async getPurchaseById(orgId, id) {
    const purchase = await Purchase.findOne({ _id: id, orgId }).populate('supplierId');
    if (!purchase) throw new Error('Purchase not found');
    
    const items = await PurchaseItem.find({ purchaseId: id, orgId });
    return { ...purchase.toJSON(), items };
  },

  async createPurchase(orgId, userId, data) {
    const { items, ...purchaseData } = data;

    // Generate purchase number
    const count = await Purchase.countDocuments({ orgId });
    const purchaseNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const purchase = new Purchase({
      ...purchaseData,
      orgId,
      purchaseNumber,
      createdBy: userId,
    });

    await purchase.save();

    const purchaseItems = items.map(item => ({
      ...item,
      purchaseId: purchase._id,
      orgId
    }));

    await PurchaseItem.insertMany(purchaseItems);

    // If purchase is confirmed/received, update stock and supplier due
    if (purchase.status === 'confirmed' || purchase.status === 'received') {
      await this.processPurchaseDetails(purchase, items, userId);
    }

    return await this.getPurchaseById(orgId, purchase._id);
  },

  async updatePurchase(orgId, userId, id, data) {
    const { items, status, ...purchaseData } = data;
    const existing = await Purchase.findOne({ _id: id, orgId });
    
    if (!existing) throw new Error('Purchase not found');
    if (existing.status !== 'draft') throw new Error('Only draft purchases can be edited');

    // Update basic fields
    Object.assign(existing, purchaseData);
    if (status) existing.status = status;
    
    await existing.save();

    if (items && items.length > 0) {
      await PurchaseItem.deleteMany({ purchaseId: id, orgId });
      const purchaseItems = items.map(item => ({
        ...item,
        purchaseId: existing._id,
        orgId
      }));
      await PurchaseItem.insertMany(purchaseItems);
    }

    // Load full set for processing
    const currentItems = await PurchaseItem.find({ purchaseId: id, orgId });

    if (existing.status === 'confirmed' || existing.status === 'received') {
      await this.processPurchaseDetails(existing, currentItems, userId);
    }

    return await this.getPurchaseById(orgId, id);
  },

  async processPurchaseDetails(purchase, items, userId) {
    // 1. Stock In
    for (const item of items) {
      await stockService.adjustStock(purchase.orgId, purchase.shopId, userId, {
        productId: item.productId,
        variantId: item.variantId,
        type: 'purchase',
        quantity: item.quantity,
        unitSymbol: item.unit,
        note: `Purchase ${purchase.purchaseNumber}`,
        referenceId: purchase._id,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate
      });
    }

    // 2. Update Supplier Dues
    if (purchase.dueAmount > 0) {
      await supplierService.updateSupplierDue(purchase.orgId, purchase.supplierId, purchase.dueAmount);
    }
  }
};

module.exports = purchaseService;
