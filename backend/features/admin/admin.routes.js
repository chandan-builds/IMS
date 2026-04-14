const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

// Super Admin Routes
router.use(protect);
router.use(authorize('super_admin'));

router.get('/organizations', adminController.getAllOrganizations);
router.put('/organizations/:id/subscription', adminController.updateSubscription);
router.put('/organizations/:id/status', adminController.updateOrgStatus);

module.exports = router;