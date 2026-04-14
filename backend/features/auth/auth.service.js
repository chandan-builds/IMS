const User = require('./auth.model');
const Organization = require('../org/org.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const registerOrganizationAndSuperAdmin = async (orgData, userData) => {
  // Start session for atomic transaction
  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create Organization
    const [organization] = await Organization.create([orgData], { session });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 3. Create Super Admin User linked to Org
    const userPayload = {
      ...userData,
      password: hashedPassword,
      orgId: organization._id,
      role: 'super_admin'
    };
    const [user] = await User.create([userPayload], { session });

    await session.commitTransaction();
    session.endSession();

    // 4. Generate Token
    const token = generateToken(user._id);

    return { organization, user: { _id: user._id, name: user.name, email: user.email, role: user.role, orgId: user.orgId }, token };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new Error('User account is not active');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role, orgId: user.orgId }, token };
};

module.exports = {
  registerOrganizationAndSuperAdmin,
  login,
  generateToken
};
