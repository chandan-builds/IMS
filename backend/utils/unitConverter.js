/**
 * Convert quantity from one unit to base unit.
 * @param {number} quantity - The amount in source unit
 * @param {string} fromUnitSymbol - Source unit symbol ("kg")
 * @param {Array} unitDefs - Array of unit definitions from DB
 * @returns {number} quantity in base unit
 */
function toBaseUnit(quantity, fromUnitSymbol, unitDefs) {
  const unit = unitDefs.find(u => u.symbol === fromUnitSymbol);
  if (!unit) throw new Error(`Unknown unit: ${fromUnitSymbol}`);
  return quantity * unit.conversionToBase;
}

/**
 * Convert quantity from base unit to display unit.
 * @param {number} baseQuantity - The amount in base unit
 * @param {string} toUnitSymbol - Target unit symbol ("kg")
 * @param {Array} unitDefs - Array of unit definitions from DB
 * @returns {number} quantity in target unit
 */
function fromBaseUnit(baseQuantity, toUnitSymbol, unitDefs) {
  const unit = unitDefs.find(u => u.symbol === toUnitSymbol);
  if (!unit) throw new Error(`Unknown unit: ${toUnitSymbol}`);
  return baseQuantity / unit.conversionToBase;
}

/**
 * Convert between any two compatible units.
 */
function convert(quantity, fromSymbol, toSymbol, unitDefs) {
  const base = toBaseUnit(quantity, fromSymbol, unitDefs);
  return fromBaseUnit(base, toSymbol, unitDefs);
}

module.exports = {
  toBaseUnit,
  fromBaseUnit,
  convert
};
