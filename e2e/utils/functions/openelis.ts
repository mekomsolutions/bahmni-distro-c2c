import { expect, Page } from '@playwright/test';
import { OPENELIS_URL } from '../configs/globalSetup';
import { delay, patientName } from './bahmni';

export class OpenELIS {
  constructor(readonly page: Page) {}

  async open() {
    await this.page.goto(`${OPENELIS_URL}`);
    await this.page.locator("input[name='loginName']").fill(`${process.env.OPENELIS_USERNAME}`);
    await this.page.locator("input[name='password']").fill(`${process.env.OPENELIS_PASSWORD}`);
    await this.page.locator('#submitButton').click();
    await delay(6000);
  }

  async searchClient() {
    await this.page.locator('#menu_labDashboard').click();
    await delay(5000);
    await this.page.locator('input#refreshButton').click();
    await expect(this.page.locator('input[type=text]').nth(1)).toBeVisible();
    await this.page.locator('input[type=text]').nth(1).type(`${patientName.givenName + ' ' + patientName.familyName}`);
  }

  async collectSample() {
    await this.page.locator('#todaySamplesToCollectListContainer-slick-grid div.slick-viewport div.slick-cell.l6.r6.cell-title a').click();
    await this.page.locator('#orderDisplay tbody input.textButton').click();
    await this.page.locator('#saveButtonId').first().click();
  }

  async enterLabResults() {
    await this.page.locator('#result').first().click();
    await this.page.locator('#results_1').selectOption('Negatif');
    await this.page.locator('#saveButtonId').first().click();
  }

  async enterNumericalResults() {
    await this.page.locator('#result').first().click();
    await this.page.locator('#results_1').click();
    await this.page.locator('#results_1').fill('13.7');
    await this.page.locator('#cell_1').click();
    await this.page.locator('#saveButtonId').first().click();
  }

  async enterFreeTextResults() {
    await this.page.locator('#result').first().click();
    await this.page.locator('#results_1').fill('Abnormal level');
    await this.page.locator('#abnormalId_1').click();
    await this.page.locator('#saveButtonId').first().click();
  }

  async validateLabResults() {
    await this.page.locator('a#validate').first().click();
    await this.page.locator('#accepted_0').check();
    await this.page.locator('#saveButtonId').first().click();
    await delay(8000);
  }
}
