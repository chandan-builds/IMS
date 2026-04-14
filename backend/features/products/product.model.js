const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', default: null }, // null = available in all shops
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String, required: true }, // Auto-generated or manual
  barcode: { type: String },
  brand: { type: String },
  description: { type: String },
  images: [{ type: String }],

  // ── Unit Configuration ──
  unitType: {
    type: String,
    required: true,
    enum: ['weight', 'volume', 'length', 'count']
  },
  baseUnitSymbol: { type: String, required: true }, // "g", "ml", "mm", "pcs"
  purchaseUnitSymbol: { type: String, required: true }, // "kg" — unit used when buying
  saleUnitSymbol: { type: String, required: true }, // "kg" — unit used when selling
  customConversions: [{ // Per-product overrides (e.g., 1 box = 24 pcs)
    unitSymbol: { type: String, required: true },
    toBaseMultiplier: { type: Number, required: true }
  }],

  // ── Pricing ──
  purchasePrice: { type: Number, required: true }, // Per purchase unit
  salePrice: { type: Number, required: true }, // Per sale unit
  mrp: { type: Number }, // Maximum retail price
  taxRate: { type: Number }, // Override org default if needed
  margin: { type: Number }, // Calculated field

  // ── Stock Thresholds ──
  minStock: { type: Number, default: 0 }, // In base unit
  maxStock: { type: Number }, // In base unit (optional)
  reorderLevel: { type: Number },

  // ── Optional Fields ──
  hasVariants: { type: Boolean, default: false },
  batchTracking: { type: Boolean, default: false },
  expiryTracking: { type: Boolean, default: false },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },

  // ── Status ──
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  tags: [{ type: String }],
  customFields: { type: Map, of: mongoose.Schema.Types.Mixed }, // Flexible key-value for shop-specific needs

}, { timestamps: true });

productSchema.index({ orgId: 1, sku: 1 }, { unique: true });
productSchema.index({ orgId: 1, barcode: 1 });
productSchema.index({ orgId: 1, categoryId: 1 });
productSchema.index({ orgId: 1, name: "text" });

module.exports = mongoose.model('Product', productSchema);
