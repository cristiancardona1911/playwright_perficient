import { test as base, expect } from '@playwright/test';
import { AccountPage } from '../pages/account.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ContactPage } from '../pages/contact.page';
import { ProductsPage } from '../pages/products.page';
import { createTestUser, type TestUser } from '../testdata/users';

type TestFixtures = {
  accountPage: AccountPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactPage: ContactPage;
  productsPage: ProductsPage;
  testUser: TestUser;
};

export const test = base.extend<TestFixtures>({
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  testUser: async ({}, use) => {
    await use(createTestUser());
  },
});

export { expect };
