const express = require('express');
const purchaseController = require('./purchase.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

const router = express.Router();

router.use(protect);
router.use(tenantScope);

router.get('/', checkPermissions('purchases.view'), purchaseController.getPurchases);
router.get('/:id', checkPermissions('purchases.view'), purchaseController.getPurchaseById);
router.post('/', checkPermissions('purchases.create'), purchaseController.createPurchase);
router.put('/:id', checkPermissions('purchases.edit'), purchaseController.updatePurchase);

module.exports = router;
