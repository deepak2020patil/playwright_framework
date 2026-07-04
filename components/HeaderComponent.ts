/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  private readonly brandLink: Locator;

  constructor(private page: Page) {
    this.brandLink = this.page.locator('a.navbar__brand');
  }

  async getBrandLinkHref() {
    return this.brandLink.getAttribute('href');
  }
}

