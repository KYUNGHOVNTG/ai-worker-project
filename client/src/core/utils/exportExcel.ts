import * as XLSX from 'xlsx';

export interface ExcelColumn {
  key: string;
  header: string;
  width?: number;
}

export interface ExportToExcelOptions<T = Record<string, unknown>> {
  filename: string;
  sheetName?: string;
  columns: ExcelColumn[];
  data: T[];
}

export interface ExportConfig {
  filename: string;
  sheetName?: string;
}

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function exportToExcel<T extends Record<string, unknown>>({
  filename,
  sheetName = 'Sheet1',
  columns,
  data,
}: ExportToExcelOptions<T>): void {
  const headerRow = columns.map((col) => col.header);

  const dataRows = data.map((row) =>
    columns.map((col) => {
      const val = row[col.key];
      return val == null ? '' : val;
    })
  );

  const worksheetData = [headerRow, ...dataRows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  worksheet['!cols'] = columns.map((col) => ({
    wch: col.width ?? 15,
  }));

  const headerRange = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1');
  for (let c = headerRange.s.c; c <= headerRange.e.c; c++) {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c });
    if (!worksheet[cellAddr]) continue;
    worksheet[cellAddr].s = {
      font: { bold: true },
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'E2E8F0' },
      },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const today = getTodayString();
  const fullFilename = `${filename}_${today}.xlsx`;

  XLSX.writeFile(workbook, fullFilename);
}
