import { Page, expect } from '@playwright/test';
import { BAHMNI_URL } from '../configs/globalSetup';

export var patientName = {
  givenName : '',
  familyName : '',
  updatedGivenName: '',
}

export const delay = (mills) => {
  let datetime1 = new Date().getTime();
  let datetime2 = datetime1 + mills;
  while(datetime1 < datetime2) {
     datetime1 = new Date().getTime();
    }
}

export class Bahmni {
  constructor(readonly page: Page) {}

  async login() {
    await this.page.goto(`${BAHMNI_URL}`)
    await this.page.locator('#username').fill(`${process.env.BAHMNI_USERNAME}`);
    await this.page.locator('#password').fill(`${process.env.BAHMNI_PASSWORD}`);
    await this.page.locator('#location').selectOption('object:7');
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async registerPatient() {
    patientName = {
      givenName : `E2e_test_${Array.from({ length: 4 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      familyName : `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`, 
      updatedGivenName : `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
    }
    await this.page.goto(`${BAHMNI_URL}/bahmni/registration`);
    await this.page.locator('a').filter({ hasText: 'Create New' }).click();
    await this.page.locator('#givenName').fill(`${patientName.givenName}`);
    await this.page.locator('#familyName').fill(`${patientName.familyName}`);
    await this.page.locator('#gender').selectOption('F');
    await this.page.locator('#ageYears').fill(`${Math.floor(Math.random() * 99)}`);
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

  async updatePatientDetails() {
    await this.page.getByRole('link', { name: 'Registration' }).click();
    await this.page.locator('#name').fill(`${patientName.familyName}`);
    await this.page.locator('form[name="searchByNameForm"]').getByRole('button', { name: 'Search' }).click();
    await this.page.locator('#view-content td:nth-child(1) a').click();
    await expect(this.page.locator('#givenName')).toBeVisible();
    await this.page.locator('#givenName').clear();
    await delay(1000);
    await this.page.locator('#givenName').type(`${patientName.updatedGivenName}`);
    await this.page.getByRole('button', { name: 'Save' }).click();
    patientName.givenName = `${patientName.updatedGivenName}`;
    await delay(8000);
  };

  async voidPatient() {
    await this.page.goto(`${BAHMNI_URL}/openmrs/admin/patients/index.htm`);
    await this.page.getByPlaceholder(' ').type(`${patientName.familyName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Void patient created by smoke test');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();
    const message = await this.page.locator('//*[@id="patientFormVoided"]').textContent();
    await expect(message?.includes('This patient has been deleted')).toBeTruthy();
  }

  async navigateToPatientDashboard() {
    await this.page.goto(`${BAHMNI_URL}/bahmni/home`);
    await this.page.getByRole('link', { name: 'Clinical' }).click();
    await this.searchPatient();
  }

  async navigateToLabSamples() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.locator('#opd-tabs').getByText('Orders').click();
    await expect(this.page.getByText('Lab Samples')).toBeVisible();
  }

  async createLabOrder() {
    await this.page.getByText('Blood', { exact: true }).click();
    await this.page.getByText('Malaria').click();
    await this.saveOrder();
  }

  async reviseLabOrder() {
    await this.page.getByText('Blood', { exact: true }).click();
    await this.page.locator('#selected-orders li').filter({ hasText: 'Malaria' }).locator('i').nth(1).click();
    await this.page.getByText('Hematocrit').click();
    await this.saveOrder();
  }

  async discontinueLabOrder() {
    await this.page.getByText('Blood', { exact: true }).click();
    await this.page.locator('#selected-orders li').filter({ hasText: 'Malaria' }).locator('i').nth(1).click();
    await this.saveOrder();
    await delay(4000);
  }

  async navigateToDiagnosis() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.locator('#opd-tabs').getByText('Diagnosis').click();
  }

  async navigateToMedications() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.locator('#opd-tabs').getByText('Medications').click();
    await expect(this.page.getByText('Order Drug')).toBeVisible();
    await expect(this.page.getByText('Order an Order Set')).toBeVisible();
  }

  async createMedication() {
    await this.page.locator('#drug-name').type('Aspirine Co 81mg');
    await this.page.getByText('Aspirine Co 81mg (Comprime)').click();
    await this.page.locator('#uniform-dose').fill('2');
    await this.page.locator('#uniform-dose-unit').selectOption('string:Application(s)');
    await this.page.locator('#frequency').selectOption('string:Q3H');
    await this.page.locator('#route').selectOption('string:Topique');
    await this.page.locator('#start-date').fill('2024-08-16');
    await this.page.locator('#duration').fill('5');
    await this.page.locator('#duration-unit').selectOption('string:Semaine(s)');
    await this.page.locator('#total-quantity-unit').selectOption('string:Ampoule(s)');
    await this.page.locator('#instructions').selectOption('string:Estomac vide');
    await this.page.locator('#additional-instructions').fill('Take after a meal');
    await expect(this.page.locator('#quantity')).toHaveValue('560');
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.saveOrder();
  }

  async editMedicationDetails() {
    await this.page.locator('i.fa.fa-edit').first().click();
    await this.page.locator('#uniform-dose').clear();
    await this.page.locator('#uniform-dose').fill('4');
    await this.page.locator('#frequency').selectOption('string:Q4H');
    await this.page.locator('#uniform-dose-unit').selectOption('string:Comprime(s)');
    await this.page.locator('#route').selectOption('string:Inhalation');
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.saveOrder();
  }

  async discontinueMedication() {
    await this.page.getByRole('button', { name: 'Stop' }).first().click();
    await this.page.getByPlaceholder('Notes').fill('Patient allergic to medicine');
    await this.saveOrder();
    await this.page.locator('#dashboard-link span.patient-name').click();
    const medicationStatus = await this.page.locator('#dashboard-treatments span.discontinued-text').first();
    await expect(medicationStatus).toContainText('Stopped');
  }

  async saveOrder() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.getByText('Saved', {exact: true})).toBeVisible();
    await delay(8000);
  }
}
