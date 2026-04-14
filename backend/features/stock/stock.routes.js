const express = require('express');
const router = express.Router();
const stockController = require('./stock.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');

// All stock routes are protected and scoped
router.use(protect, tenantScope);

// GET /api/v1/stock - Current stock list
router.get('/', authorize('staff'), stockController.getCurrentStock);

// GET /api/v1/stock/transactions - Stock ledger
router.get('/transactions', authorize('staff'), stockController.getStockTransactions);

// GET /api/v1/stock/:productId - Product stock detail
router.get('/:productId', authorize('staff'), stockController.getProductStockDetail);

// POST /api/v1/stock/adjust - Manual adjustment
router.post('/adjust', checkPermissions('stock.adjust'), stockController.adjustStock);

// POST /api/v1/stock/transfer - Transfer between shops
router.post('/transfer', checkPermissions('stock.transfer'), stockController.transferStock);

module.exports = router;
