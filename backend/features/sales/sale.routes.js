const express = require('express');
const saleController = require('./sale.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

const router = express.Router();

router.use(protect);
router.use(tenantScope);

router.get('/', checkPermissions('sales.view'), saleController.getSales);
router.get('/:id', checkPermissions('sales.view'), saleController.getSaleById);
router.post('/', checkPermissions('sales.create'), saleController.createSale);
router.put('/:id', checkPermissions('sales.edit'), saleController.updateSale);

module.exports = router;
