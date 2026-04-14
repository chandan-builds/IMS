const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
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
  baseQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  displayUnit: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: false });

// Unique compound index so there's only one stock record per product/variant/shop
stockSchema.index({ orgId: 1, productId: 1, variantId: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
