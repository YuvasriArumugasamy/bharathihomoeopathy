/**
 * Export data to a clean CSV file compatible with Microsoft Excel and Google Sheets.
 * Includes UTF-8 BOM so currency symbols (₹) and Indian text render properly.
 */
export const exportToCsv = (filename, columns, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Header row
  const headerRow = columns.map(col => `"${(col.label || '').replace(/"/g, '""')}"`).join(',');

  // Data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let val = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

/**
 * Export data to Excel-compatible XLS format.
 * Uses HTML table format which Excel can open directly.
 */
export const exportToExcel = (filename, columns, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Build HTML table
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
  html += '<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
  html += '<x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
  html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
  html += '<table border="1">';
  
  // Header row
  html += '<thead><tr>';
  columns.forEach(col => {
    html += `<th style="background-color: #f97316; color: white; font-weight: bold; padding: 8px;">${col.label || ''}</th>`;
  });
  html += '</tr></thead>';
  
  // Data rows
  html += '<tbody>';
  data.forEach(item => {
    html += '<tr>';
    columns.forEach(col => {
      let val = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
      if (val === null || val === undefined) val = '';
      html += `<td style="padding: 6px;">${String(val).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></body></html>';

  // Create blob and download with .xls extension
  const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};
