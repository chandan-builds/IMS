const saleService = require('./sale.service');

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
