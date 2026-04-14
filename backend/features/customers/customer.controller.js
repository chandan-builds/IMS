const customerService = require('./customer.service');

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
