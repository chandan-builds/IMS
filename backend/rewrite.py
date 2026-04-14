import os

files = {
    r'src/features/suppliers/supplier.model.js': '''const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  gstNumber: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  totalDue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

supplierSchema.index({ orgId: 1, name: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
''',

    r'src/features/suppliers/supplier.service.js': '''const Supplier = require('./supplier.model');
const { paginateQuery } = require('../../utils/paginateQuery');

const supplierService = {
  async getSuppliers(orgId, reqQuery) {
    const filter = { orgId };
    
    if (reqQuery.search) {
      filter.name = { $regex: reqQuery.search, $options: 'i' };
    }
    if (reqQuery.status) {
      filter.status = reqQuery.status;
    }

    const query = Supplier.find(filter);
    return await paginateQuery(query, reqQuery);
  },

  async getSupplierById(orgId, id) {
    const supplier = await Supplier.findOne({ _id: id, orgId });
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  },

  async createSupplier(orgId, data) {
    const supplier = new Supplier({
      ...data,
      orgId
    });
    await supplier.save();
    return supplier;
  },

  async updateSupplier(orgId, id, data) {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: id, orgId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  },

  async updateSupplierDue(orgId, id, amountChange) {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: id, orgId },
      { $inc: { totalDue: amountChange } },
      { new: true }
    );
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  }
};

module.exports = supplierService;
''',

    r'src/features/suppliers/supplier.controller.js': '''const supplierService = require('./supplier.service');

const supplierController = {
  async getSuppliers(req, res, next) {
    try {
      const result = await supplierService.getSuppliers(req.orgId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getSupplierById(req, res, next) {
    try {
      const supplier = await supplierService.getSupplierById(req.orgId, req.params.id);
      res.json({ data: supplier });
    } catch (error) {
      next(error);
    }
  },

  async createSupplier(req, res, next) {
    try {
      const supplier = await supplierService.createSupplier(req.orgId, req.body);
      res.status(201).json({ data: supplier, message: 'Supplier created successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateSupplier(req, res, next) {
    try {
      const supplier = await supplierService.updateSupplier(req.orgId, req.params.id, req.body);
      res.json({ data: supplier, message: 'Supplier updated successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = supplierController;
''',

    r'src/features/suppliers/supplier.routes.js': '''const express = require('express');
const supplierController = require('./supplier.controller');
const auth = require('../../middleware/auth');
const tenantScope = require('../../middleware/tenantScope');
const rbac = require('../../middleware/rbac');

const router = express.Router();

router.use(auth);
router.use(tenantScope);

router.get('/', rbac.permit('suppliers.view'), supplierController.getSuppliers);
router.get('/:id', rbac.permit('suppliers.view'), supplierController.getSupplierById);
router.post('/', rbac.permit('suppliers.create'), supplierController.createSupplier);
router.put('/:id', rbac.permit('suppliers.edit'), supplierController.updateSupplier);

module.exports = router;
''',

    r'src/features/customers/customer.model.js': '''const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  gstNumber: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['B2B', 'B2C'],
    default: 'B2C'
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  totalDue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

customerSchema.index({ orgId: 1, phone: 1 });
customerSchema.index({ orgId: 1, type: 1 });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
''',

    r'src/features/customers/customer.service.js': '''const Customer = require('./customer.model');
const { paginateQuery } = require('../../utils/paginateQuery');

const customerService = {
  async getCustomers(orgId, reqQuery) {
    const filter = { orgId };
    
    if (reqQuery.search) {
      filter.$or = [
        { name: { $regex: reqQuery.search, $options: 'i' } },
        { phone: { $regex: reqQuery.search, $options: 'i' } }
      ];
    }
    if (reqQuery.type) {
      filter.type = reqQuery.type;
    }
    if (reqQuery.status) {
      filter.status = reqQuery.status;
    }

    const query = Customer.find(filter);
    return await paginateQuery(query, reqQuery);
  },

  async getCustomerById(orgId, id) {
    const customer = await Customer.findOne({ _id: id, orgId });
    if (!customer) throw new Error('Customer not found');
    return customer;
  },

  async createCustomer(orgId, data) {
    const customer = new Customer({
      ...data,
      orgId
    });
    await customer.save();
    return customer;
  },

  async updateCustomer(orgId, id, data) {
    const customer = await Customer.findOneAndUpdate(
      { _id: id, orgId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!customer) throw new Error('Customer not found');
    return customer;
  },

  async updateCustomerDue(orgId, id, amountChange) {
    const customer = await Customer.findOneAndUpdate(
      { _id: id, orgId },
      { $inc: { totalDue: amountChange } },
      { new: true }
    );
    if (!customer) throw new Error('Customer not found');
    return customer;
  }
};

module.exports = customerService;
''',

    r'src/features/customers/customer.controller.js': '''const customerService = require('./customer.service');

const customerController = {
  async getCustomers(req, res, next) {
    try {
      const result = await customerService.getCustomers(req.orgId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getCustomerById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.orgId, req.params.id);
      res.json({ data: customer });
    } catch (error) {
      next(error);
    }
  },

  async createCustomer(req, res, next) {
    try {
      const customer = await customerService.createCustomer(req.orgId, req.body);
      res.status(201).json({ data: customer, message: 'Customer created successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateCustomer(req, res, next) {
    try {
      const customer = await customerService.updateCustomer(req.orgId, req.params.id, req.body);
      res.json({ data: customer, message: 'Customer updated successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
''',

    r'src/features/customers/customer.routes.js': '''const express = require('express');
const customerController = require('./customer.controller');
const auth = require('../../middleware/auth');
const tenantScope = require('../../middleware/tenantScope');
const rbac = require('../../middleware/rbac');

const router = express.Router();

router.use(auth);
router.use(tenantScope);

router.get('/', rbac.permit('customers.view'), customerController.getCustomers);
router.get('/:id', rbac.permit('customers.view'), customerController.getCustomerById);
router.post('/', rbac.permit('customers.create'), customerController.createCustomer);
router.put('/:id', rbac.permit('customers.edit'), customerController.updateCustomer);

module.exports = router;
''',

    r'src/features/purchases/purchaseItem.model.js': '''const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    default: null
  },
  productName: String,
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  baseQuantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true }
}, { timestamps: true });

purchaseItemSchema.index({ orgId: 1, purchaseId: 1 });

const PurchaseItem = mongoose.model('PurchaseItem', purchaseItemSchema);
module.exports = PurchaseItem;
''',

    r'src/features/purchases/purchase.model.js': '''const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  purchaseNumber: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  subtotal: { type: Number, default: 0 },
  taxTotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid'
  },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentMethod: String,
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'received', 'cancelled'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

purchaseSchema.index({ orgId: 1, purchaseNumber: 1 }, { unique: true });
purchaseSchema.index({ orgId: 1, supplierId: 1 });
purchaseSchema.index({ orgId: 1, purchaseDate: -1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
''',

    r'src/features/purchases/purchase.service.js': '''const Purchase = require('./purchase.model');
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
        unit: item.unit,
        note: `Purchase ${purchase.purchaseNumber}`,
        referenceId: purchase._id
      });
    }

    // 2. Update Supplier Dues
    if (purchase.dueAmount > 0) {
      await supplierService.updateSupplierDue(purchase.orgId, purchase.supplierId, purchase.dueAmount);
    }
  }
};

module.exports = purchaseService;
''',

    r'src/features/purchases/purchase.controller.js': '''const purchaseService = require('./purchase.service');

const purchaseController = {
  async getPurchases(req, res, next) {
    try {
      const result = await purchaseService.getPurchases(req.orgId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getPurchaseById(req, res, next) {
    try {
      const purchase = await purchaseService.getPurchaseById(req.orgId, req.params.id);
      res.json({ data: purchase });
    } catch (error) {
      next(error);
    }
  },

  async createPurchase(req, res, next) {
    try {
      const purchase = await purchaseService.createPurchase(req.orgId, req.user._id, req.body);
      res.status(201).json({ data: purchase, message: 'Purchase created successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updatePurchase(req, res, next) {
    try {
      const purchase = await purchaseService.updatePurchase(req.orgId, req.user._id, req.params.id, req.body);
      res.json({ data: purchase, message: 'Purchase updated successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = purchaseController;
''',

    r'src/features/purchases/purchase.routes.js': '''const express = require('express');
const purchaseController = require('./purchase.controller');
const auth = require('../../middleware/auth');
const tenantScope = require('../../middleware/tenantScope');
const rbac = require('../../middleware/rbac');

const router = express.Router();

router.use(auth);
router.use(tenantScope);

router.get('/', rbac.permit('purchases.view'), purchaseController.getPurchases);
router.get('/:id', rbac.permit('purchases.view'), purchaseController.getPurchaseById);
router.post('/', rbac.permit('purchases.create'), purchaseController.createPurchase);
router.put('/:id', rbac.permit('purchases.edit'), purchaseController.updatePurchase);

module.exports = router;
''',

    r'src/features/sales/saleItem.model.js': '''const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    default: null
  },
  productName: String,
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  baseQuantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true }
}, { timestamps: true });

saleItemSchema.index({ orgId: 1, saleId: 1 });

const SaleItem = mongoose.model('SaleItem', saleItemSchema);
module.exports = SaleItem;
''',

    r'src/features/sales/sale.model.js': '''const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  saleType: {
    type: String,
    enum: ['B2B', 'B2C'],
    default: 'B2C'
  },
  subtotal: { type: Number, default: 0 },
  taxTotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid'
  },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentMethod: String,
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'completed', 'cancelled'],
    default: 'completed'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

saleSchema.index({ orgId: 1, invoiceNumber: 1 }, { unique: true });
saleSchema.index({ orgId: 1, customerId: 1 });
saleSchema.index({ orgId: 1, saleDate: -1 });

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
''',

    r'src/features/sales/sale.service.js': '''const Sale = require('./sale.model');
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
''',

    r'src/features/sales/sale.controller.js': '''const saleService = require('./sale.service');

const saleController = {
  async getSales(req, res, next) {
    try {
      const result = await saleService.getSales(req.orgId, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getSaleById(req, res, next) {
    try {
      const sale = await saleService.getSaleById(req.orgId, req.params.id);
      res.json({ data: sale });
    } catch (error) {
      next(error);
    }
  },

  async createSale(req, res, next) {
    try {
      const sale = await saleService.createSale(req.orgId, req.user._id, req.body);
      res.status(201).json({ data: sale, message: 'Sale created successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updateSale(req, res, next) {
    try {
      const sale = await saleService.updateSale(req.orgId, req.user._id, req.params.id, req.body);
      res.json({ data: sale, message: 'Sale updated successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = saleController;
''',

    r'src/features/sales/sale.routes.js': '''const express = require('express');
const saleController = require('./sale.controller');
const auth = require('../../middleware/auth');
const tenantScope = require('../../middleware/tenantScope');
const rbac = require('../../middleware/rbac');

const router = express.Router();

router.use(auth);
router.use(tenantScope);

router.get('/', rbac.permit('sales.view'), saleController.getSales);
router.get('/:id', rbac.permit('sales.view'), saleController.getSaleById);
router.post('/', rbac.permit('sales.create'), saleController.createSale);
router.put('/:id', rbac.permit('sales.edit'), saleController.updateSale);

module.exports = router;
'''
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('Rewrite complete')
