const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  gstNumber: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  totalDue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

supplierSchema.index({ orgId: 1, name: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
