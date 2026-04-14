const stockService = require('./stock.service');

exports.getCurrentStock = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const { productId, shopId, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (productId) filter.productId = productId;
    if (shopId) filter.shopId = shopId;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const result = await stockService.getStockList(orgId, filter, { skip, limit: parseInt(limit) });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProductStockDetail = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const { productId } = req.params;
    
    const result = await stockService.getStockList(orgId, { productId }, { skip: 0, limit: 100 });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.adjustStock = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const userId = req.user._id;
    // req.body should have: shopId, productId, variantId, type, quantity, unitSymbol, note
    const result = await stockService.adjustStock(orgId, userId, req.body);
    return res.status(200).json({ message: 'Stock adjusted successfully', data: result });
  } catch (error) {
    next(error);
  }
};

exports.transferStock = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const userId = req.user._id;
    // req.body should have: fromShopId, toShopId, productId, variantId, quantity, unitSymbol, note
    const result = await stockService.transferStock(orgId, userId, req.body);
    return res.status(200).json({ message: 'Stock transferred successfully', data: result });
  } catch (error) {
    next(error);
  }
};

exports.getStockTransactions = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const { productId, shopId, type, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (productId) filter.productId = productId;
    if (shopId) filter.shopId = shopId;
    if (type) filter.type = type;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const result = await stockService.getStockLedger(orgId, filter, { skip, limit: parseInt(limit) });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
