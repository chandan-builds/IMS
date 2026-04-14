const Sale = require('./sale.model');
const SaleItem = require('./saleItem.model');
const stockService = require('../stock/stock.service');
const customerService = require('../customers/customer.service');
const { paginateQuery } = require('../../utils/paginateQuery');

const saleService = {
  async getSales(orgId, reqQuery) {
    const filter = { orgId };
    if (reqQuery.status) filter.status = reqQuery.status;
    if (reqQuery.customerId) filter.customerId = reqQuery.customerId;
    if (reqQuery.saleType) filter.saleType = reqQuery.saleType;

    const query = Sale.find(filter);
    return await paginateQuery(query, reqQuery);
  },

  async getSaleById(orgId, id) {
    const sale = await Sale.findOne({ _id: id, orgId }).populate('customerId');
    if (!sale) throw new Error('Sale not found');
    
    const items = await SaleItem.find({ saleId: id, orgId });
    return { ...sale.toJSON(), items };
  },

  async createSale(orgId, userId, data) {
    const { items, ...saleData } = data;

    // Generate invoice number
    const count = await Sale.countDocuments({ orgId });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const sale = new Sale({
      ...saleData,
      orgId,
      invoiceNumber,
      createdBy: userId,
    });

    await sale.save();

    const saleItems = items.map(item => ({
      ...item,
      saleId: sale._id,
      orgId
    }));

    await SaleItem.insertMany(saleItems);

    // If sale is completed, update stock and customer due
    if (sale.status === 'completed') {
      await this.processSaleDetails(sale, items, userId);
    }

    return await this.getSaleById(orgId, sale._id);
  },

  async updateSale(orgId, userId, id, data) {
    const { items, status, ...saleData } = data;
    const existing = await Sale.findOne({ _id: id, orgId });
    
    if (!existing) throw new Error('Sale not found');
    if (existing.status !== 'draft') throw new Error('Only draft sales can be edited');

    // Update basic fields
    Object.assign(existing, saleData);
    if (status) existing.status = status;
    
    await existing.save();

    if (items && items.length > 0) {
      await SaleItem.deleteMany({ saleId: id, orgId });
      const saleItems = items.map(item => ({
        ...item,
        saleId: existing._id,
        orgId
      }));
      await SaleItem.insertMany(saleItems);
    }

    // Load full set for processing
    const currentItems = await SaleItem.find({ saleId: id, orgId });

    if (existing.status === 'completed') {
      await this.processSaleDetails(existing, currentItems, userId);
    }

    return await this.getSaleById(orgId, id);
  },

  async processSaleDetails(sale, items, userId) {
    // 1. Stock Out
    for (const item of items) {
      await stockService.adjustStock(sale.orgId, sale.shopId, userId, {
        productId: item.productId,
        variantId: item.variantId,
        type: 'sale',
        quantity: -Math.abs(item.quantity),
        unit: item.unit,
        note: `Sale ${sale.invoiceNumber}`,
        referenceId: sale._id
      });
    }

    // 2. Update Customer Dues
    if (sale.dueAmount > 0 && sale.customerId) {
      await customerService.updateCustomerDue(sale.orgId, sale.customerId, sale.dueAmount);
    }
  }
};

module.exports = saleService;
