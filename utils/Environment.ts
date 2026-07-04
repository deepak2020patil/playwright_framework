export class Environment {
  static get(name: string, fallback = '') {
    return process.env[name] ?? fallback;
  }
}
