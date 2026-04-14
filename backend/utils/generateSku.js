/**
 * Generate a unique SKU
 * @param {string} prefix - Optional prefix, e.g., category slug or 'PRD'
 * @returns {string} Generated SKU
 */
function generateSku(prefix = 'PRD') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix.toUpperCase()}-${timestamp}-${randomStr}`;
}

module.exports = {
  generateSku
};
