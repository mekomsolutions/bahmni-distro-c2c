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

test('Record, revise and discontinue a drug order.', async ({ page }) => {
  // setup
  await bahmni.registerPatient();

  // replay
  await bahmni.goToMedications();
  await page.locator('#drug-name').type('Aspirine Co 81mg');
  await page.getByText('Aspirine Co 81mg (Comprime)').click();
  await page.locator('#uniform-dose').fill('2');
  await page.locator('#uniform-dose-unit').selectOption('string:Application(s)');
  await page.locator('#frequency').selectOption('string:Q3H');
  await page.locator('#route').selectOption('string:Topique');
  await page.locator('#start-date').fill('2024-08-16');
  await page.locator('#duration').fill('5');
  await page.locator('#duration-unit').selectOption('string:Semaine(s)');
  await page.locator('#total-quantity-unit').selectOption('string:Ampoule(s)');
  await page.locator('#instructions').selectOption('string:Estomac vide');
  await page.locator('#additional-instructions').fill('Take after a meal');
  await page.getByRole('button', { name: 'Add' }).click();
  await bahmni.saveOrder();

  // verify
  await page.locator('#dashboard-link span.patient-name').click();
  const drugNameSelector = await page.locator('treatment-table td.drug.active-drug span');
  const medicationDetailsSelector = await page.locator('#dashboard-treatments td.dosage  span:nth-child(1)');
  await expect(drugNameSelector).toHaveText('Aspirine Co 81mg (Comprime)');
  await expect(medicationDetailsSelector).toContainText('2 Application(s)');
  await expect(medicationDetailsSelector).toContainText('Q3H');
  await expect(medicationDetailsSelector).toContainText('Estomac vide');
  await expect(medicationDetailsSelector).toContainText('Topique');

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
  await page.locator('#dashboard-link span.patient-name').click();
  await expect(medicationDetailsSelector).not.toContainText('2 Application(s)');
  await expect(medicationDetailsSelector).toContainText('4 Comprime(s)');
  await expect(medicationDetailsSelector).not.toContainText('Q3H');
  await expect(medicationDetailsSelector).toContainText('Q4H,');
  await expect(medicationDetailsSelector).not.toContainText('Ampoule(s)');
  await expect(medicationDetailsSelector).toContainText('Inhalation');

  await page.locator('#view-content :nth-child(1).btn--success').click();
  await page.getByText('Medications', { exact: true }).click();
  const drugSelector = await page.locator('strong.drug-name').first();
  await expect(drugSelector).toContainText('Aspirine Co 81mg (Comprime)');
  await page.getByRole('button', { name: 'Stop' }).first().click();
  await page.getByPlaceholder('Notes').clear();
  await page.getByPlaceholder('Notes').fill('Patient allergic to medicine');
  await bahmni.saveOrder();
  await expect(page.getByText(/no recent treatments/i)).toBeVisible();
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
