const Unit = require('./unit.model');
const { convert } = require('../../utils/unitConverter');

exports.getUnits = async (orgId) => {
  // Return system units (orgId = null) and org-specific units
  return await Unit.find({
    $or: [{ orgId: null }, { orgId }]
  });
};

exports.createUnit = async (orgId, unitData) => {
  const unit = new Unit({
    ...unitData,
    orgId,
    isSystem: false // org created units are never system units
  });
  return await unit.save();
};

exports.convert = async (orgId, quantity, fromSymbol, toSymbol) => {
  const units = await exports.getUnits(orgId);
  return convert(quantity, fromSymbol, toSymbol, units);
};

exports.updateUnit = async (orgId, id, updateData) => {
  // Ensure we only update org-specific units, not system units
  return await Unit.findOneAndUpdate(
    { _id: id, orgId }, 
    { $set: updateData }, 
    { new: true }
  );
};

exports.deleteUnit = async (orgId, id) => {
  // Ensure we only delete org-specific units
  return await Unit.findOneAndDelete({ _id: id, orgId });
};
