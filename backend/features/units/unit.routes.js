const express = require('express');
const router = express.Router();
const unitController = require('./unit.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

// Apply auth and tenant scope to all routes
router.use(protect);
router.use(tenantScope);

router.get('/', unitController.getUnits);
router.post('/', authorize('org_admin', 'super_admin'), unitController.createUnit);
router.get('/convert', unitController.convertUnit);
router.put('/:id', authorize('org_admin', 'super_admin'), unitController.updateUnit);
router.delete('/:id', authorize('org_admin', 'super_admin'), unitController.deleteUnit);

module.exports = router;
