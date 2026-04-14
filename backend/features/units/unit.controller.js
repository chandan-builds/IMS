const unitService = require('./unit.service');

exports.getUnits = async (req, res, next) => {
  try {
    const units = await unitService.getUnits(req.orgId);
    res.json(units);
  } catch (error) {
    next(error);
  }
};

exports.createUnit = async (req, res, next) => {
  try {
    const unit = await unitService.createUnit(req.orgId, req.body);
    res.status(201).json(unit);
  } catch (error) {
    next(error);
  }
};

exports.convertUnit = async (req, res, next) => {
  try {
    const { quantity, fromSymbol, toSymbol } = req.query;
    if (!quantity || !fromSymbol || !toSymbol) {
      return res.status(400).json({ error: 'quantity, fromSymbol, and toSymbol are required' });
    }
    const result = await unitService.convert(req.orgId, Number(quantity), fromSymbol, toSymbol);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

exports.updateUnit = async (req, res, next) => {
  try {
    const unit = await unitService.updateUnit(req.orgId, req.params.id, req.body);
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(unit);
  } catch (error) {
    next(error);
  }
};

exports.deleteUnit = async (req, res, next) => {
  try {
    await unitService.deleteUnit(req.orgId, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
