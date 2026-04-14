const orgService = require('./org.service');

const getMyOrganization = async (req, res, next) => {
  try {
    const org = await orgService.getOrganizationById(req.orgId);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    
    res.status(200).json({
      success: true,
      data: org
    });
  } catch (error) {
    next(error);
  }
};

const updateMyOrganization = async (req, res, next) => {
  try {
    const org = await orgService.updateOrganization(req.orgId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: org
    });
  } catch (error) {
    next(error);
  }
};

const addShop = async (req, res, next) => {
  try {
    const org = await orgService.setupInitialShop(req.orgId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Shop added successfully',
      data: org
    });
  } catch (error) {
    if (error.message === 'Organization not found') {
        return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const exportOrgData = async (req, res, next) => {
  try {
    const data = await orgService.exportOrganizationData(req.orgId);
    
    res.setHeader('Content-disposition', `attachment; filename=org_export_${req.orgId}_${Date.now()}.json`);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyOrganization,
  updateMyOrganization,
  addShop,
  exportOrgData
};
