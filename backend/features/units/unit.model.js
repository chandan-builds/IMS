const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null }, // null for system defaults
  name: { type: String, required: true }, // e.g. "Kilogram"
  symbol: { type: String, required: true }, // e.g. "kg"
  type: {
    type: String,
    required: true,
    enum: ['weight', 'volume', 'length', 'count', 'custom']
  },
  baseUnit: { type: String, required: true }, // The base for this type: "g", "ml", "mm", "pcs"
  conversionToBase: { type: Number, required: true }, // 1 kg = 1000 g → conversionToBase = 1000
  isBaseUnit: { type: Boolean, default: false }, // true if this IS the base unit
  isSystem: { type: Boolean, default: false }, // true for pre-seeded units
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

unitSchema.index({ orgId: 1, symbol: 1 }, { unique: true });
unitSchema.index({ orgId: 1, type: 1 });

module.exports = mongoose.model('Unit', unitSchema);
