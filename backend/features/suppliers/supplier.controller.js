const supplierService = require('./supplier.service');

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
