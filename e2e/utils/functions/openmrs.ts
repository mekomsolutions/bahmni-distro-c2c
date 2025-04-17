import { Page, expect } from '@playwright/test';
import { delay } from './bahmni';

const today = new Date();
export const currentDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

export class OpenMRS {
  constructor(readonly page: Page) {}

  async startPatientVisit() {
    await this.page.locator('#view-content div>ul>li button').click();
    await expect(this.page.getByRole('button', { name: /save/i })).toBeEnabled();
    await this.page.getByRole('button', { name: /priority/i }).click();
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText('error')).not.toBeVisible();
  }

  async startPostnatalVisit() {
    await this.page.locator('button[bm-pop-over-trigger]').click();
    await this.page.getByRole('button', { name: 'Start Post-natale visit' }).click();
    await expect(this.page.getByRole('button', { name: /save/i })).toBeEnabled();
    await this.page.getByRole('button', { name: /priority/i }).click();
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText('error')).not.toBeVisible();
  }

  async navigateToReports() {
    await this.page.getByRole('link', { name: /Administration/i, exact: true }).click();
    await expect(this.page.getByRole('link', { name: 'Report Administration' }).first()).toBeVisible();
    await this.page.getByRole('link', { name: 'Report Administration' }).first().click();
  }

  async runMSPPVisitReport() {
    await this.page.getByRole('row', { name: 'MSPP Visits Report' }).getByRole('link').nth(2).click();
    await this.page.locator('#userEnteredParamstartDate').fill(`${currentDate}`);
    await this.page.locator('#userEnteredParamendDate').fill(`${currentDate}`);
    await this.page.getByRole('button', { name: 'Request Report' }).click(), delay(10000);
  }

  async navigateToForms() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await expect(this.page.getByRole('button', { name: /add new obs form/i })).toBeVisible();
    await this.page.getByRole('button', { name: /add new obs form/i  }).click();
  }

  async navigateToPatientRegistationForm() {
    await this.page.getByRole('link', { name: /registration/i }).click();
  }
}
