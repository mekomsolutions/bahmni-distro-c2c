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

test('Create, revise and discontinue lab tests.', async ({ page }) => {
  // setup
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.enterPatientDetails();
  await bahmni.startPatientVisit();

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToLabSamples();
  await page.getByText('Blood', { exact: true }).click();
  await page.getByText('Malaria', { exact: true }).click();
  await page.getByText('Urine').click();
  await page.getByText('Gravindex').click();
  await page.getByText('Stool').click();
  await page.getByText('Stool Colour').click();
  await page.getByText('Vaginal Swab').click();
  await page.getByText('Bacteries').click();
  await page.getByText('Sputum').click();
  await page.getByText('Serial sputum bacilloscopy').click();
  await bahmni.save();

  // verify creation
  await page.locator('#dashboard-link span.patient-name').click();
  await expect(page.locator('#Lab-Orders').getByText('Malaria')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Gravindex')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Stool Colour')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Bacteria')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Serial sputum bacilloscopy')).toBeVisible();

  // verify revision
  await page.locator('#view-content :nth-child(1).btn--success').click();
  await page.getByText('Orders', { exact: true }).click();
  await page.getByText('Blood', { exact: true }).click();
  await page.locator('#selected-orders li').filter({ hasText: 'Malaria' }).locator('i').nth(1).click();
  await page.getByText('Blood Sugar').click();
  await page.getByText('Urine').click();
  await page.locator('#selected-orders li').filter({ hasText: 'Gravindex' }).locator('i').nth(1).click();
  await page.getByText('Urine Colour').click();
  await page.getByText('Stool', { exact: true }).click();
  await page.getByText('Stool Parasites').click();
  await bahmni.save();

  // verify revision
  await page.locator('#dashboard-link span.patient-name').click();
  await expect(page.locator('#Lab-Orders').getByText('Malaria')).not.toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Blood Sugar')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Gravindex')).not.toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Urine Colour')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Stool Colour')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Stool Parasites')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Bacteria')).toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Serial sputum bacilloscopy')).toBeVisible();

  // verify cancellation
  await page.locator('#view-content :nth-child(1).btn--success').click();
  await page.getByText('Orders', { exact: true }).click();
  await page.locator('#selected-orders li').filter({ hasText: 'Blood Sugar' }).locator('i').nth(1).click();
  await page.locator('#selected-orders li').filter({ hasText: 'Urine Colour' }).locator('i').nth(1).click();
  await page.locator('#selected-orders li').filter({ hasText: 'Stool Colour' }).locator('i').nth(1).click();
  await bahmni.save();
  await page.locator('#dashboard-link span.patient-name').click();
  await expect(page.locator('#Lab-Orders').getByText('Blood Sugar')).not.toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Urine Colour')).not.toBeVisible();
  await expect(page.locator('#Lab-Orders').getByText('Stool Colour')).not.toBeVisible();
});

test.afterEach(async ({}) => {
  await bahmni.voidPatient();
});
