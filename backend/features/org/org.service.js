const Organization = require('./org.model');
const mongoose = require('mongoose');

const getOrganizationById = async (orgId) => {
  return await Organization.findById(orgId);
};

const updateOrganization = async (orgId, updateData) => {
  return await Organization.findByIdAndUpdate(orgId, updateData, { new: true, runValidators: true });
};

const setupInitialShop = async (orgId, shopData) => {
  const org = await Organization.findById(orgId);
  if (!org) {
    throw new Error('Organization not found');
  }

  // Add the shop to the organization
  const shop = { ...shopData, isDefault: org.shops.length === 0 }; // Make default if it's the first shop
  org.shops.push(shop);
  await org.save();

  return org;
};

const exportOrganizationData = async (orgId) => {
  const orgIdObj = new mongoose.Types.ObjectId(orgId);
  
  const [org, products, stock, sales, purchases, customers, suppliers] = await Promise.all([
    Organization.findById(orgId),
    mongoose.model('Product').find({ orgId: orgIdObj }),
    mongoose.model('Stock').find({ orgId: orgIdObj }),
    mongoose.model('Sale').find({ orgId: orgIdObj }),
    mongoose.model('Purchase').find({ orgId: orgIdObj }),
    mongoose.model('Customer').find({ orgId: orgIdObj }),
    mongoose.model('Supplier').find({ orgId: orgIdObj }),
  ]);

  return {
    organization: org,
    products,
    stock,
    sales,
    purchases,
    customers,
    suppliers,
    exportedAt: new Date().toISOString()
  };
};

module.exports = {
  getOrganizationById,
  updateOrganization,
  setupInitialShop,
  exportOrganizationData
};
