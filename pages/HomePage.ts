import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class HomePage {
  readonly header: HeaderComponent;

  constructor(private page: Page) {
    this.header = new HeaderComponent(page);
  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async getHeadingText() {
    return (await this.page.locator('h1').first().textContent()) ?? '';
  }

  async getBrandLinkHref() {
    return this.header.getBrandLinkHref();
  }
}
