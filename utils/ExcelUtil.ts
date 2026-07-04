/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import XLSX from 'xlsx';

export class ExcelUtil {
  readSheet(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    return workbook.Sheets[workbook.SheetNames[0]];
  }
}

