/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */export class Environment {
  static get(name: string, fallback = '') {
    return process.env[name] ?? fallback;
  }
}

