/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { Locator, Page, expect } from '@playwright/test';
import { Logger } from './logger';

export type ElementLike = Locator | string;

export class CommonMethods {
  private logger: Logger;

  constructor(private page: Page, logger?: Logger) {
    this.logger = logger ?? new Logger();
  }

  private resolveElement(locator: ElementLike): Locator {
    return typeof locator === 'string' ? this.page.locator(locator) : locator;
  }

  async click(locator: ElementLike, options?: { timeout?: number }) {
    const element = this.resolveElement(locator);
    this.logger.info(`Clicking element: ${typeof locator === 'string' ? locator : 'locator'}`);
    await element.click({ timeout: options?.timeout ?? 10_000 });
  }

  async type(locator: ElementLike, text: string, options?: { timeout?: number }) {
    const element = this.resolveElement(locator);
    this.logger.info(`Typing into element: ${typeof locator === 'string' ? locator : 'locator'}`);
    await element.waitFor({ state: 'visible', timeout: options?.timeout ?? 10_000 });
    await element.fill(text, { timeout: options?.timeout ?? 10_000 });
  }

  async pressKey(key: string) {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  async getText(locator: ElementLike) {
    const element = this.resolveElement(locator);
    this.logger.info(`Getting text from: ${typeof locator === 'string' ? locator : 'locator'}`);
    return await element.textContent();
  }

  async getAttribute(locator: ElementLike, attributeName: string) {
    const element = this.resolveElement(locator);
    this.logger.info(`Getting attribute '${attributeName}' from: ${typeof locator === 'string' ? locator : 'locator'}`);
    return await element.getAttribute(attributeName);
  }

  async verifyLink(locator: ElementLike, expectedUrlPart: string) {
    const element = this.resolveElement(locator);
    this.logger.info(`Verifying link contains: ${expectedUrlPart}`);
    const href = await element.getAttribute('href');
    expect(href).toContain(expectedUrlPart);
  }

  async switchToNewWindow() {
    this.logger.info('Switching to new window');
    const [newWindow] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.click('a[target="_blank"]'),
    ]);
    await newWindow.waitForLoadState();
    return newWindow;
  }

  async switchToWindow(page: Page) {
    this.logger.info('Switching to specified window');
    await page.bringToFront();
  }
}

