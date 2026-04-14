const tenantScope = (req, res, next) => {
  if (req.user && req.user.orgId) {
    req.orgId = req.user.orgId;
    
    // Add shop ID to request if provided in headers
    const shopId = req.headers['x-shop-id'];
    if (shopId) {
      req.shopId = shopId;
    }
    
    next();
  } else {
    res.status(403).json({ success: false, message: 'No organization scope found' });
  }
};

module.exports = { tenantScope };
