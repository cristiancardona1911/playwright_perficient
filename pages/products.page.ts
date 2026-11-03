import type { Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/products');
    await this.ensureAvailable();
    await this.page.locator('#search_product').waitFor({ state: 'visible', timeout: 15_000 });
  }

  async search(productName: string): Promise<void> {
    await this.ensureAvailable();
    await this.page.locator('#search_product').fill(productName);
    await this.page.locator('#submit_search').click();

    try {
      await this.page.getByRole('heading', { name: 'Searched Products' }).waitFor({
        state: 'visible',
        timeout: 15_000,
      });
    } catch (error) {
      const queueNotice = this.page.getByRole('heading', {
        name: 'This website is under heavy load (queue full)',
      });

      if (await queueNotice.isVisible()) {
        throw new Error('Automation Exercise is temporarily unavailable: the site queue is full.', {
          cause: error,
        });
      }

      throw error;
    }
  }

  productCard(productId: string) {
    return this.page.locator(`.productinfo a.add-to-cart[data-product-id="${productId}"]`);
  }

  private async ensureAvailable(): Promise<void> {
    const queueNotice = this.page.getByRole('heading', {
      name: 'This website is under heavy load (queue full)',
    });

    if (await queueNotice.isVisible()) {
      throw new Error('Automation Exercise is temporarily unavailable: the site queue is full.');
    }
  }

  async addToCart(productId: string): Promise<void> {
    await this.productCard(productId).click();
    await this.page.locator('#cartModal').waitFor({ state: 'visible' });
  }

  async viewCart(): Promise<void> {
    await this.page.locator('#cartModal a[href="/view_cart"]').click();
    await this.page.waitForURL('**/view_cart');
  }
}
