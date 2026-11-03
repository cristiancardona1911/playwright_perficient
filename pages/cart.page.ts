import type { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  productRow(productId: string) {
    return this.page.locator(`#product-${productId}`);
  }

  async removeProduct(productId: string): Promise<void> {
    await this.page.locator(`#product-${productId} .cart_quantity_delete`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.locator('.check_out').click();
  }
}
