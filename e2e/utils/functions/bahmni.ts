import { Page, expect } from '@playwright/test';
import { BAHMNI_URL } from '../configs/globalSetup';

export var patientName = {
  givenName : '',
  familyName : '',
}

export class Bahmni {
  constructor(readonly page: Page) {}

  async login() {
    await this.page.goto(`${BAHMNI_URL}`)
    await this.page.locator('#locale').selectOption('string:en');
    await this.page.locator('#username').fill(`${process.env.BAHMNI_USERNAME}`);
    await this.page.locator('#password').fill(`${process.env.BAHMNI_PASSWORD}`);
    await this.page.locator('#location').selectOption('object:7');
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async registerPatient() {
    patientName = {
      givenName : `e2e_test_${Math.floor(Math.random() * 10000)}`,
      familyName : `${(Math.random() + 1).toString(36).substring(2)}`,
    }
    await this.page.goto(`${BAHMNI_URL}/bahmni/registration`);
    await this.page.locator('a').filter({ hasText: 'Create New' }).click();
    await this.page.locator('#givenName').fill(`${patientName.givenName}`);
    await this.page.locator('#familyName').fill(`${patientName.familyName}`);
    await this.page.locator('#gender').selectOption('F');
    await this.page.locator('#ageYears').fill('34');
    await this.page.locator('#view-content div>ul>li button').click();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await this.page.getByRole('button', { name: 'Priority' }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText('error')).not.toBeVisible();
  }

  async searchPatient() {
    await this.page.locator('#patientIdentifier').fill(`${patientName.familyName}`);
    await this.page.getByText(`${patientName.givenName + ' ' + patientName.familyName}`).click();
  }

  async voidPatient() {
    await this.page.goto(`${BAHMNI_URL}/openmrs/admin/patients/index.htm`);
    await this.page.getByPlaceholder(' ').type(`${patientName.familyName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Void patient created by smoke test');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();
    const message = await this.page.locator('//*[@id="patientFormVoided"]').textContent();
    await expect(message?.includes('This patient has been deleted')).toBeTruthy();
  }

  async goToLabSamples() {
    await this.page.locator('i.fa.fa-home').click();
    await this.page.getByRole('link', { name: 'Clinical' }).click();
    await this.searchPatient();
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.getByText('Orders', { exact: true }).click();
    await expect(this.page.getByText('Lab Samples')).toBeVisible();
  }

  async goToMedications() {
    await this.page.locator('i.fa.fa-home').click();
    await this.page.getByRole('link', { name: 'Clinical' }).click();
    await this.searchPatient();
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.getByText('Medications', { exact: true }).click();
    await expect(this.page.getByText('Order Drug')).toBeVisible();
    await expect(this.page.getByText('Order an Order Set')).toBeVisible();
  }

  async saveOrder() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText('Saved', {exact: true})).toBeVisible();
  }
}
