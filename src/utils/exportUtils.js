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
