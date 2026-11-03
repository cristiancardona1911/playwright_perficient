import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures/test.fixture';
import { products } from '../testdata/products';

test('registers an account, logs out, logs back in, and deletes the account', async ({
  accountPage,
  page,
  browserName,
  testUser,
}) => {
  test.skip(browserName !== 'chromium', 'Account lifecycle writes are limited to Chromium.');
  await accountPage.register(testUser);
  await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();

  await accountPage.logout();
  await expect(page).toHaveURL(/\/login$/);

  await accountPage.login(testUser.email, testUser.password);
  await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();

  await accountPage.deleteAccount();
  await expect(page.getByText('Account Deleted!', { exact: true })).toBeVisible();
});

test('rejects login with invalid credentials', async ({ accountPage, browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Functional workflows are limited to Chromium.');
  await accountPage.openLogin();
  await accountPage.login('missing-user@example.com', 'InvalidPassword!1');

  await expect(page.getByText('Your email or password is incorrect!', { exact: true })).toBeVisible();
});

test('search finds a product and mocks its cart response in Chromium', async ({
  browserName,
  page,
  productsPage,
}) => {
  await productsPage.open();
  await productsPage.search(products.blueTop.name);

  await expect(page.getByText(products.blueTop.name, { exact: true }).first()).toBeVisible();
  await expect(productsPage.productCard(products.blueTop.id)).toBeVisible();

  if (browserName === 'chromium') {
    let intercepted = false;
    await page.route(`**/add_to_cart/${products.blueTop.id}`, async (route) => {
      intercepted = true;
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Product added' });
    });
    await productsPage.addToCart(products.blueTop.id);
    expect(intercepted).toBe(true);
  }
});

test('adds a product to the cart and removes it', async ({ browserName, cartPage, page, productsPage }) => {
  test.skip(browserName !== 'chromium', 'Cart state changes are limited to Chromium.');
  await productsPage.open();
  await productsPage.search(products.blueTop.name);
  await productsPage.addToCart(products.blueTop.id);
  await productsPage.viewCart();

  await expect(cartPage.productRow(products.blueTop.id)).toContainText(products.blueTop.name);
  await cartPage.removeProduct(products.blueTop.id);

  await expect(page.locator('#empty_cart')).toBeVisible();
});

test('requires a logged-in account to proceed to checkout', async ({ browserName, cartPage, page, productsPage }) => {
  test.skip(browserName !== 'chromium', 'Checkout workflows are limited to Chromium.');
  await productsPage.open();
  await productsPage.search(products.blueTop.name);
  await productsPage.addToCart(products.blueTop.id);
  await productsPage.viewCart();
  await cartPage.proceedToCheckout();

  await expect(page.locator('#checkoutModal')).toBeVisible();
  await expect(page.locator('#checkoutModal')).toContainText('Register / Login account to proceed on checkout.');
});

test('places an order for a registered customer', async ({
  accountPage,
  cartPage,
  checkoutPage,
  browserName,
  page,
  productsPage,
  testUser,
}) => {
  test.skip(browserName !== 'chromium', 'Account creation and order placement are limited to Chromium.');
  await accountPage.register(testUser);
  await productsPage.open();
  await productsPage.search(products.blueTop.name);
  await productsPage.addToCart(products.blueTop.id);
  await productsPage.viewCart();
  await cartPage.proceedToCheckout();

  await expect(page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
  await expect(page.getByText(products.blueTop.name, { exact: true })).toBeVisible();
  await checkoutPage.openPayment();
  await checkoutPage.placeOrder();

  await expect(page.getByText('Order Placed!', { exact: true })).toBeVisible();
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

  await page.locator('[data-qa="continue-button"]').click();
  await accountPage.deleteAccount();
  await expect(page.getByText('Account Deleted!', { exact: true })).toBeVisible();
});

test('validates required contact email and displays a submission confirmation', async ({
  browserName,
  contactPage,
  page,
}) => {
  test.skip(browserName !== 'chromium', 'Contact form interaction is limited to Chromium.');
  await contactPage.open();
  await page.locator('[data-qa="name"]').fill('Playwright QA');
  await page.locator('[data-qa="subject"]').fill('Automated contact form test');
  await page.locator('[data-qa="message"]').fill('This message is submitted by an automated test.');
  await contactPage.submit();

  await expect(page.locator('[data-qa="email"]')).toHaveJSProperty('validity.valid', false);

  await contactPage.fillMessage('playwright.qa@example.com');
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
  await contactPage.submit();

  await expect(page.locator('#contact-page .alert-success')).toHaveText(
    'Success! Your details have been submitted successfully.',
  );
  await expect(page.locator('#form-section a[href="/"]')).toBeVisible();
});

test.describe('Accessibility and visual validation', () => {
  test.describe.configure({ retries: 1 });

  test('checks accessibility and visual rendering of the searched product', async ({
    page,
    productsPage,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'Accessibility and visual baselines are maintained for Chromium.');
    await productsPage.open();
    await productsPage.search(products.blueTop.name);

    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .include('.productinfo')
      .analyze();
    const criticalViolations = accessibility.violations.filter((violation) => violation.impact === 'critical');
    expect(criticalViolations).toEqual([]);

    await expect(page.locator('.productinfo').first()).toHaveScreenshot('blue-top-product.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});
