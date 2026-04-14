const purchaseService = require('./purchase.service');

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
