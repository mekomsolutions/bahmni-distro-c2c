import { expect, Page } from '@playwright/test';
import { patientName } from './bahmni';
import { ODOO_URL } from '../configs/globalSetup';

export class Odoo {
  constructor(readonly page: Page) {}

  async open() {
    await this.page.goto(`${ODOO_URL}`);
    await this.page.getByPlaceholder(/email/i).fill(`${process.env.ODOO_USERNAME}`);
    await this.page.getByPlaceholder(/password/i).fill(`${process.env.ODOO_PASSWORD}`);
    await this.page.locator('button[type="submit"]').click();
    await expect(this.page).toHaveURL(/.*web/);
  }

  async searchCustomer() {
    await this.page.locator("//a[contains(@class, 'full')]").click();
    await expect(this.page.locator('ul.o_menu_apps a:nth-child(2)')).toBeVisible();
    await this.page.locator('ul.o_menu_apps a:nth-child(2)').click();
    await expect(this.page.locator('.breadcrumb-item')).toHaveText(/quotations/i);
    await this.page.locator('input.o_searchview_input').type(`${patientName.givenName + ' ' + patientName.familyName}`);
    await this.page.locator('input.o_searchview_input').press('Enter');
  }
}
