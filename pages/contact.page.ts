import type { Page } from '@playwright/test';

export class ContactPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/contact_us');
  }

  async fillMessage(email: string): Promise<void> {
    await this.page.locator('[data-qa="name"]').fill('Playwright QA');
    await this.page.locator('[data-qa="email"]').fill(email);
    await this.page.locator('[data-qa="subject"]').fill('Automated contact form test');
    await this.page.locator('[data-qa="message"]').fill('This message is submitted by an automated test.');
  }

  async submit(): Promise<void> {
    await this.page.locator('[data-qa="submit-button"]').click();
  }
}
