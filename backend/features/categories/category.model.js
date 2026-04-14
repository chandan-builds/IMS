const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // Nested categories
  image: { type: String },
  sortOrder: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

categorySchema.index({ orgId: 1, slug: 1 }, { unique: true });
categorySchema.index({ orgId: 1, parentId: 1 });

module.exports = mongoose.model('Category', categorySchema);
