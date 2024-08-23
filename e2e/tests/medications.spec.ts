import { test, expect } from '@playwright/test';
import { Bahmni } from '../utils/functions/bahmni';

let bahmni: Bahmni;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/linical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/appointment scheduling/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
});

test('Create, revise and discontinue a drug order.', async ({ page }) => {
  // setup
  await bahmni.registerPatient();

  // replay
  await bahmni.goToHomePage();
  await bahmni.goToMedications();
  await bahmni.createMedication();

  // verify creation
  const drugNameSelector = await page.locator('#ordered-drug-orders strong.drug-name').first();
  const medicationDetailsSelector = await page.locator('#ordered-drug-orders div.drug-details').first();
  await expect(drugNameSelector).toHaveText('Aspirine Co 81mg (Comprime)');
  await expect(medicationDetailsSelector).toContainText('2 Application(s)');
  await expect(medicationDetailsSelector).toContainText('Q3H');
  await expect(medicationDetailsSelector).toContainText('Estomac vide');
  await expect(medicationDetailsSelector).toContainText('Topique');
  await page.locator('#dashboard-link span.patient-name').click();
  const medicationSelector = await page.locator('treatment-table td.drug.active-drug span');
  await expect(medicationSelector).toHaveText('Aspirine Co 81mg (Comprime)');

  // verify revision
  await page.locator('#view-content :nth-child(1).btn--success').click();
  await page.getByText('Medications', { exact: true }).click();
  await page.locator('#ordered-drug-orders button:nth-child(1) i').first().click();
  await page.locator('#uniform-dose').clear();
  await page.locator('#uniform-dose').fill('4');
  await page.locator('#frequency').selectOption('string:Q4H');
  await page.locator('#uniform-dose-unit').selectOption('string:Comprime(s)');
  await page.locator('#route').selectOption('string:Inhalation');
  await page.getByRole('button', { name: 'Add' }).click();
  await bahmni.saveOrder();
  await expect(medicationDetailsSelector).not.toContainText('2 Application(s)');
  await expect(medicationDetailsSelector).toContainText('4 Comprime(s)');
  await expect(medicationDetailsSelector).not.toContainText('Q3H');
  await expect(medicationDetailsSelector).toContainText('Q4H,');
  await expect(medicationDetailsSelector).not.toContainText('Ampoule(s)');
  await expect(medicationDetailsSelector).toContainText('Inhalation');

  // verify cancellation
  await expect(drugNameSelector).toContainText('Aspirine Co 81mg (Comprime)');
  await page.getByRole('button', { name: 'Stop' }).first().click();
  await page.getByPlaceholder('Notes').fill('Patient allergic to medicine');
  await bahmni.saveOrder();
  await page.locator('#dashboard-link span.patient-name').click();
  const medicationStatus = await page.locator('#dashboard-treatments span.discontinued-text').first();
  await expect(medicationStatus).toContainText('Stopped');
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
