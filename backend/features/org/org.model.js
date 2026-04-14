const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    businessType: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: String,
    email: String,
    logo: String,
    currency: {
      code: { type: String, default: 'INR' },
      symbol: { type: String, default: '₹' },
    },
    taxConfig: {
      enabled: { type: Boolean, default: false },
      defaultRate: Number,
      taxLabel: String,
      taxTypes: [
        {
          name: String,
          rate: Number,
        },
      ],
    },
    settings: {
      allowNegativeStock: { type: Boolean, default: false },
      defaultBusinessModel: { type: String, enum: ['B2B', 'B2C', 'BOTH'], default: 'B2C' },
      fiscalYearStart: Number,
      invoicePrefix: String,
      purchaseOrderPrefix: String,
    },
    subscription: {
      plan: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
      expiresAt: Date,
      maxUsers: Number,
      maxProducts: Number,
      maxShops: Number,
    },
    shops: [
      {
        name: String,
        address: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: String,
        },
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    status: { type: String, enum: ['active', 'suspended', 'trial'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', orgSchema);