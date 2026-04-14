const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

// Apply auth and tenant scope to all routes
router.use(protect);
router.use(tenantScope);

router.get('/', categoryController.getCategories);
router.post('/', authorize('org_admin', 'super_admin'), categoryController.createCategory);
router.put('/:id', authorize('org_admin', 'super_admin'), categoryController.updateCategory);
router.delete('/:id', authorize('org_admin', 'super_admin'), categoryController.deleteCategory);

module.exports = router;
