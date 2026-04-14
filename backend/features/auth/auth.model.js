const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'org_admin', 'staff'], default: 'staff' },
    permissions: [{ type: String }],
    assignedShops: [{ type: mongoose.Schema.Types.ObjectId }],
    avatar: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.index({ orgId: 1, role: 1 });

module.exports = mongoose.model('User', userSchema);