const express = require('express');
const customerController = require('./customer.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

const router = express.Router();

router.use(protect);
router.use(tenantScope);

router.get('/', checkPermissions('customers.view'), customerController.getCustomers);
router.get('/:id', checkPermissions('customers.view'), customerController.getCustomerById);
router.post('/', checkPermissions('customers.create'), customerController.createCustomer);
router.put('/:id', checkPermissions('customers.edit'), customerController.updateCustomer);

module.exports = router;
