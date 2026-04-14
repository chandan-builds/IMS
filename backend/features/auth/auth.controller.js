const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const { orgName, orgSlug, name, email, password, phone } = req.body;
    
    const orgData = { name: orgName, slug: orgSlug, email, phone };
    const userData = { name, email, password, phone };

    const result = await authService.registerOrganizationAndSuperAdmin(orgData, userData);

    res.status(201).json({
      success: true,
      message: 'Organization and Super Admin registered successfully',
      data: result
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email or Organization slug already exists' });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error.message === 'Invalid email or password' || error.message === 'User account is not active') {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
