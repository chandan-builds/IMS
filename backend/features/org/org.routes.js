const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { getMyOrganization, updateMyOrganization, addShop, exportOrgData } = require('./org.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize } = require('../../middleware/rbac');
const validate = require('../../middleware/validate');

const orgUpdateSchema = Joi.object({
  name: Joi.string(),
  businessType: Joi.string(),
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    zipCode: Joi.string().allow('', null),
    country: Joi.string().allow('', null)
  }),
  phone: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  currency: Joi.object({
    code: Joi.string(),
    symbol: Joi.string()
  }),
  taxConfig: Joi.object({
    enabled: Joi.boolean(),
    defaultRate: Joi.number(),
    taxLabel: Joi.string(),
    taxTypes: Joi.array().items(Joi.object({
      name: Joi.string(),
      rate: Joi.number()
    }))
  }),
  settings: Joi.object({
    allowNegativeStock: Joi.boolean(),
    defaultBusinessModel: Joi.string().valid('B2B', 'B2C', 'BOTH'),
    fiscalYearStart: Joi.number(),
    invoicePrefix: Joi.string().allow('', null),
    purchaseOrderPrefix: Joi.string().allow('', null),
    themeColor: Joi.string().allow('', null)
  })
});

const shopSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    zipCode: Joi.string().allow('', null),
    country: Joi.string().allow('', null)
  }),
  phone: Joi.string().allow('', null),
  isDefault: Joi.boolean()
});

// All routes require authentication and tenant scope
router.use(protect);
router.use(tenantScope);

router.get('/', getMyOrganization);
router.put('/', authorize('super_admin', 'org_admin'), validate(orgUpdateSchema), updateMyOrganization);
router.post('/shops', authorize('super_admin', 'org_admin'), validate(shopSchema), addShop);
router.get('/export', authorize('super_admin', 'org_admin'), exportOrgData);

module.exports = router;
