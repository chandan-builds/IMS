const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`
      });
    }
    next();
  };
};

const checkPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || req.user.role === 'super_admin') {
      return next(); // Super admin bypasses permission check
    }
    
    const hasPermission = permissions.every(p => req.user.permissions && req.user.permissions.includes(p));
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = { authorize, checkPermissions };
