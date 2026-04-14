const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    default: null
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  type: {
    type: String,
    enum: ["purchase", "sale", "adjustment", "damage", "return", "transfer_in", "transfer_out"],
    required: true
  },
  quantity: { // Quantity in the unit specified
    type: Number,
    required: true
  },
  unit: { // Symbol of the unit specified, e.g. "kg", "pcs"
    type: String,
    required: true
  },
  baseQuantity: { // Quantity converted to base unit (+ or - based on type)
    type: Number,
    required: true
  },
  balanceAfter: { // Running balance in base unit after this transaction
    type: Number,
    required: true
  },
  referenceType: { // Type of document that triggered this
    type: String,
    enum: ["purchase", "sale", "adjustment", "transfer"],
    required: true
  },
  referenceId: { // Link to purchase/sale/etc id
    type: mongoose.Schema.Types.ObjectId
  },
  note: {
    type: String
  },
  batchNumber: {
    type: String,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

stockTransactionSchema.index({ orgId: 1, productId: 1, createdAt: -1 });
stockTransactionSchema.index({ orgId: 1, type: 1 });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
