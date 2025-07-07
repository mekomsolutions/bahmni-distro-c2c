
import { test, expect } from '@playwright/test';
import { Bahmni } from '../utils/functions/bahmni';

let bahmni: Bahmni;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/clinical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
});

test('Create and revise a diagnosis.', async ({ page }) => {
  // setup
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.enterPatientDetails();
  await bahmni.startPatientVisit();

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToDiagnosis();
  await page.locator('#name-0').fill('Candidiasis (B37.9)');
  await page.getByText('Candidiasis (B37.9)').click();
  await page.locator('#order-0').getByRole('button', { name: /primary/i }).click();
  await page.locator('#certainty-0').getByRole('button', { name: /confirmed/i }).click();
  await bahmni.save();

  // verify creation
  await page.locator('#dashboard-link span.patient-name').click();
  await expect(page.locator('#diagnosisName')).toContainText(/candidiasis/i);
  await expect(page.locator('#order')).toContainText(/primary/i);
  await expect(page.locator('#certainty')).toContainText(/confirmed/i);

  // verify revision
  await page.locator('#view-content :nth-child(1).btn--success').click();
  await page.locator('#opd-tabs').getByText('Diagnosis').click();
  await page.locator('i.fa.fa-edit').first().click();
  const diagnosisOrderButton = await page.getByRole('button', { name: 'SECONDARY' }).nth(1);
  await diagnosisOrderButton.waitFor({ state: 'visible' });
  await diagnosisOrderButton.focus();
  await diagnosisOrderButton.click();
  await bahmni.save();
  await page.locator('#dashboard-link span.patient-name').click();
  await expect(page.locator('#diagnosisName')).toContainText(/candidiasis/i);
  await expect(page.locator('#order')).toContainText(/secondary/i);
  await expect(page.locator('#certainty')).toContainText(/confirmed/i);
});

test.afterEach(async ({}) => {
  await bahmni.voidPatient();
});
