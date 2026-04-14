const adminService = require('./admin.service');

exports.getAllOrganizations = async (req, res, next) => {
  try {
    const orgs = await adminService.getAllOrganizations(req.query);
    res.json({ success: true, data: orgs });
  } catch (error) {
    next(error);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const org = await adminService.updateSubscription(id, req.body);
    res.json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

exports.updateOrgStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const org = await adminService.updateOrgStatus(id, status);
    res.json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};