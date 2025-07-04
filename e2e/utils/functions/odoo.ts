import { expect, Page } from '@playwright/test';
import { delay, patientName } from './bahmni';
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

  async navigateToInvoice() {
    await this.page.locator("//a[contains(@class, 'full')]").click();
    await expect(this.page.getByRole('menuitem', { name: /invoicing/i })).toBeVisible();
    await this.page.getByRole('menuitem', { name: /invoicing/i }).click();
  }

  async navigateToOtherInfo() {
    await this.page.getByLabel(/main actions/i).getByRole('button', { name: /create/i }).click();
    await this.page.getByRole('tab', { name: /other info/i }).click();
  }

  async navigateToInvoiceLines() {
    await this.page.getByRole('tab', { name: /invoice lines/i }).click();
  }

  async createInvoice() {
    await this.page.getByLabel('Customer', { exact: true }).type(`${patientName.givenName + ' ' + patientName.familyName}`);
    await this.page.getByText(`${patientName.givenName + ' ' + patientName.familyName}`).first().click();
    await this.page.getByRole('button', { name: 'Add a line' }).click();
    await this.page.locator('td.o_data_cell:nth-child(2) div:nth-child(1) input').fill('Acétaminophene Co 500mg');
    await this.page.getByText('Acétaminophene Co 500mg').first().click();
    await this.page.locator('td:nth-child(4) input').fill('8');
    await this.page.locator('td:nth-child(6) input').fill('2.20');
    await this.page.locator('.o_selected_row .o_list_number.o_readonly_modifier').click();
    await this.page.getByRole('button', { name: /confirm/i }).click(), delay(1500)
    await this.page.getByRole('button', { name: /save/i }).click();
  }

}
