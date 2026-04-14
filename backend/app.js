const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./features/auth/auth.routes');
const orgRoutes = require('./features/org/org.routes');
const unitRoutes = require('./features/units/unit.routes');
const categoryRoutes = require('./features/categories/category.routes');
const productRoutes = require('./features/products/product.routes');
const stockRoutes = require('./features/stock/stock.routes');
const supplierRoutes = require('./features/suppliers/supplier.routes');
const customerRoutes = require('./features/customers/customer.routes');
const purchaseRoutes = require('./features/purchases/purchase.routes');
const saleRoutes = require('./features/sales/sale.routes');
const reportRoutes = require('./features/reports/report.routes');
const adminRoutes = require('./features/admin/admin.routes');
const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/org', orgRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/stock', stockRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/sales', saleRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
