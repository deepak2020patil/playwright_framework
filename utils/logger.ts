/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */export class Logger {
  info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }

  debug(message: string) {
    console.log(`[DEBUG] ${message}`);
  }
}

