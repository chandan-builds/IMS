const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
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
  costPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  batchNumber: { type: String, default: null },
  expiryDate: { type: Date, default: null }
}, { timestamps: true });

purchaseItemSchema.index({ orgId: 1, purchaseId: 1 });

const PurchaseItem = mongoose.model('PurchaseItem', purchaseItemSchema);
module.exports = PurchaseItem;
