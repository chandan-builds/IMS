const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantName: { type: String, required: true }, // "500g Pack", "1L Bottle"
  sku: { type: String, required: true },
  barcode: { type: String },
  unitSymbol: { type: String, required: true },
  quantity: { type: Number, required: true }, // How many base units in this variant
  purchasePrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  mrp: { type: Number },
  image: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

variantSchema.index({ orgId: 1, productId: 1 });
variantSchema.index({ orgId: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model('ProductVariant', variantSchema);
