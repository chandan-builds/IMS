const Supplier = require('./supplier.model');
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
