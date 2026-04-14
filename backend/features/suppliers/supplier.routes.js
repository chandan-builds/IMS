const express = require('express');
const supplierController = require('./supplier.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

const router = express.Router();

router.use(protect);
router.use(tenantScope);

router.get('/', checkPermissions('suppliers.view'), supplierController.getSuppliers);
router.get('/:id', checkPermissions('suppliers.view'), supplierController.getSupplierById);
router.post('/', checkPermissions('suppliers.create'), supplierController.createSupplier);
router.put('/:id', checkPermissions('suppliers.edit'), supplierController.updateSupplier);

module.exports = router;
