const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  saleType: {
    type: String,
    enum: ['B2B', 'B2C'],
    default: 'B2C'
  },
  subtotal: { type: Number, default: 0 },
  taxTotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid'
  },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentMethod: String,
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'completed', 'cancelled'],
    default: 'completed'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

saleSchema.index({ orgId: 1, invoiceNumber: 1 }, { unique: true });
saleSchema.index({ orgId: 1, customerId: 1 });
saleSchema.index({ orgId: 1, saleDate: -1 });

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
