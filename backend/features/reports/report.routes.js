const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize } = require('../../middleware/rbac');

// All authenticated users with roles can access reports
router.use(protect, tenantScope);

router.get('/dashboard', authorize('super_admin', 'org_admin', 'staff'), reportController.getDashboardKPIs);
router.get('/stock', authorize('super_admin', 'org_admin', 'staff'), reportController.getStockReport);
router.get('/sales', authorize('super_admin', 'org_admin', 'staff'), reportController.getSalesReport);
router.get('/purchases', authorize('super_admin', 'org_admin', 'staff'), reportController.getPurchaseReport);
router.get('/monthly-summary', authorize('super_admin', 'org_admin', 'staff'), reportController.getMonthlySummary);
router.get('/profit', authorize('super_admin', 'org_admin', 'staff'), reportController.getProfitReport);

module.exports = router;
