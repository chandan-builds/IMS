const xlsx = require('xlsx');

/**
 * Parses an uploaded Excel file to JSON
 * @param {Buffer} buffer - File buffer
 * @returns {Array<Object>} Parsed JSON array
 */
function parseExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

/**
 * Generates an Excel file buffer from JSON
 * @param {Array<Object>} data - JSON data
 * @param {string} sheetName - Optional sheet name
 * @returns {Buffer} Excel file buffer
 */
function generateExcel(data, sheetName = 'Data') {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
  parseExcel,
  generateExcel
};
