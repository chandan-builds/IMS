const reportService = require('./report.service');

exports.getDashboardKPIs = async (req, res, next) => {
  try {
    const kpis = await reportService.getDashboardKPIs(req.orgId, req.query.shopId);
    res.json(kpis);
  } catch (error) {
    next(error);
  }
};

exports.getStockReport = async (req, res, next) => {
  try {
    const report = await reportService.getStockReport(req.orgId, req.query.shopId);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

exports.getSalesReport = async (req, res, next) => {
  try {
    const { shopId, startDate, endDate, productId, categoryId } = req.query;
    const report = await reportService.getSalesReport(req.orgId, shopId, startDate, endDate, productId, categoryId);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

exports.getPurchaseReport = async (req, res, next) => {
  try {
    const { shopId, startDate, endDate } = req.query;
    const report = await reportService.getPurchaseReport(req.orgId, shopId, startDate, endDate);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlySummary = async (req, res, next) => {
  try {
    const summary = await reportService.getMonthlySummary(req.orgId, req.query.shopId);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

exports.getProfitReport = async (req, res, next) => {
  try {
    const { shopId, startDate, endDate } = req.query;
    const report = await reportService.getProfitReport(req.orgId, shopId, startDate, endDate);
    res.json(report);
  } catch (error) {
    next(error);
  }
};
