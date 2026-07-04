import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

export interface TestCase {
  name: string;
  value?: string;
  expected?: string;
}

export function readJsonTestData(): TestCase[] {
  const filePath = path.resolve(__dirname, '..', 'test-data', 'users.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as TestCase[];
}

export function readExcelTestData(): TestCase[] {
  const filePath = path.resolve(__dirname, '..', 'test-data', 'testData.xlsx');
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    return [
      { name: 'excel-fallback', value: 'sample-from-excel', expected: 'sample-from-excel' },
    ];
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Array<Record<string, unknown>>;

  return rows
    .map((row) => ({
      name: String(row.name ?? ''),
      value: row.value ? String(row.value) : '',
      expected: row.expected ? String(row.expected) : '',
    }))
    .filter((row) => row.name);
}
