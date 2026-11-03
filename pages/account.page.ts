import type { Page } from '@playwright/test';
import type { TestUser } from '../testdata/users';

export class AccountPage {
  constructor(private readonly page: Page) {}

  async openLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async signUp(user: Pick<TestUser, 'name' | 'email'>): Promise<void> {
    await this.page.locator('[data-qa="signup-name"]').fill(user.name);
    await this.page.locator('[data-qa="signup-email"]').fill(user.email);
    await this.page.locator('[data-qa="signup-button"]').click();
    await this.page.getByRole('heading', { name: 'Enter Account Information' }).waitFor();
  }

  async completeRegistration(user: TestUser): Promise<void> {
    await this.page.locator('input[name="title"][value="Mr"]').check();
    await this.page.locator('[data-qa="password"]').fill(user.password);
    await this.page.locator('[data-qa="days"]').selectOption('1');
    await this.page.locator('[data-qa="months"]').selectOption('1');
    await this.page.locator('[data-qa="years"]').selectOption('2000');
    await this.page.locator('[data-qa="first_name"]').fill(user.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastName);
    await this.page.locator('[data-qa="address"]').fill(user.address);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(user.mobileNumber);
    await this.page.locator('[data-qa="create-account"]').press('Enter');
  }

  async register(user: TestUser): Promise<void> {
    await this.openLogin();
    await this.signUp(user);
    await this.completeRegistration(user);
    await this.page.getByText('Account Created!', { exact: true }).waitFor();
    await this.page.locator('[data-qa="continue-button"]').click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async logout(): Promise<void> {
    await this.page.locator('a[href="/logout"]').click();
  }

  async deleteAccount(): Promise<void> {
    await this.page.locator('a[href="/delete_account"]').click();
  }
}
