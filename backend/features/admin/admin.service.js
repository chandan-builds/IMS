const Organization = require('../org/org.model');

class AdminService {
  async getAllOrganizations(query) {
    const filter = {};
    if (query.status) {
      filter.status = query.status;
    }
    const orgs = await Organization.find(filter).sort({ createdAt: -1 });
    return orgs;
  }

  async updateSubscription(orgId, subscriptionData) {
    const org = await Organization.findById(orgId);
    if (!org) throw new Error('Organization not found');

    org.subscription = {
      ...org.subscription,
      ...subscriptionData
    };
    await org.save();
    return org;
  }

  async updateOrgStatus(orgId, status) {
    if (!['active', 'suspended', 'trial'].includes(status)) {
      throw new Error('Invalid status');
    }
    const org = await Organization.findByIdAndUpdate(
      orgId,
      { status },
      { new: true }
    );
    if (!org) throw new Error('Organization not found');
    return org;
  }
}

module.exports = new AdminService();