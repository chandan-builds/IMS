const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  purchaseNumber: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
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
    enum: ['draft', 'confirmed', 'received', 'cancelled'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

purchaseSchema.index({ orgId: 1, purchaseNumber: 1 }, { unique: true });
purchaseSchema.index({ orgId: 1, supplierId: 1 });
purchaseSchema.index({ orgId: 1, purchaseDate: -1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
