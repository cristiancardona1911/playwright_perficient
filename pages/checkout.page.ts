import type { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async openPayment(): Promise<void> {
    await this.page.locator('a[href="/payment"]').click();
    await this.page.waitForURL('**/payment');
  }

  async placeOrder(): Promise<void> {
    await this.page.locator('[data-qa="name-on-card"]').fill('Playwright Test User');
    await this.page.locator('[data-qa="card-number"]').fill('4111111111111111');
    await this.page.locator('[data-qa="cvc"]').fill('123');
    await this.page.locator('[data-qa="expiry-month"]').fill('12');
    await this.page.locator('[data-qa="expiry-year"]').fill('2030');
    await this.page.locator('[data-qa="pay-button"]').click();
  }
}
