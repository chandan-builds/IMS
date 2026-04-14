import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string) {
  if (!data || !data.length) {
    alert('No data to export');
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
