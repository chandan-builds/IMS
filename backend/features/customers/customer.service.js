const Customer = require('./customer.model');
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
