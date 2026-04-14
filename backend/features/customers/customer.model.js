const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['B2B', 'B2C'],
    default: 'B2C'
  },
  creditLimit: {
    type: Number,
    default: 0
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

customerSchema.index({ orgId: 1, phone: 1 });
customerSchema.index({ orgId: 1, type: 1 });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
