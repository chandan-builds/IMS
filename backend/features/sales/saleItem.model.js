const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
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
  productName: String,
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  baseQuantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  batchNumber: { type: String, default: null },
  expiryDate: { type: Date, default: null }
}, { timestamps: true });

saleItemSchema.index({ orgId: 1, saleId: 1 });

const SaleItem = mongoose.model('SaleItem', saleItemSchema);
module.exports = SaleItem;
