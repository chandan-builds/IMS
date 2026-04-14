const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const { protect } = require('../../middleware/auth');
const { tenantScope } = require('../../middleware/tenantScope');
const { authorize, checkPermissions } = require('../../middleware/rbac');
const multer = require('multer');

// Configure multer for excel upload
const upload = multer({ storage: multer.memoryStorage() });

// Apply auth and tenant scope to all routes
router.use(protect);
router.use(tenantScope);

router.get('/', productController.getProducts);
router.get('/export', productController.exportProducts);
router.post('/import', checkPermissions('products.create'), upload.single('file'), productController.importProducts);
router.get('/:id', productController.getProductById);
router.post('/', checkPermissions('products.create'), productController.createProduct);
router.put('/:id', checkPermissions('products.edit'), productController.updateProduct);
router.delete('/:id', checkPermissions('products.delete'), productController.deleteProduct);

module.exports = router;
