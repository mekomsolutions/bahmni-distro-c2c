import { Page } from '@playwright/test';
import { patientName } from './bahmni';
import { ODOO_URL } from '../configs/globalSetup';

export class Odoo {
  constructor(readonly page: Page) {}

  async open() {
    await this.page.goto(`${ODOO_URL}`);
    await this.page.getByPlaceholder('Email').fill(`${process.env.ODOO_USERNAME}`);
    await this.page.getByPlaceholder('Password').click();
    await this.page.getByPlaceholder('Password').fill(`${process.env.ODOO_PASSWORD}`);
    await this.page.locator('button[type="submit"]').click();
  }

  async searchCustomer() {
    await this.page.locator("//a[contains(@class, 'full')]").click();
    await this.page.locator('ul.o_menu_apps a:nth-child(2)').click();
    await this.page.locator('input.o_searchview_input').fill(`${patientName.givenName + ' ' + patientName.familyName}`);
    await this.page.locator('input.o_searchview_input').press('Enter');
  }
}
