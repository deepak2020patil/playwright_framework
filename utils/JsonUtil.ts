import fs from 'fs';

export class JsonUtil {
  readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}
