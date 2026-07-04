/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getHeading() {
    return this.page.locator('h1').first().textContent();
  }
}

