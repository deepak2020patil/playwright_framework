/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async open(url: string) {
    await this.page.goto(url);
  }
}

