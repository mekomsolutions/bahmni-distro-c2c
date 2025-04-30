import { test, expect } from '@playwright/test';
import { BAHMNI_URL } from '../utils/configs/globalSetup';
import { Bahmni, delay, patientName } from '../utils/functions/bahmni';
import { OpenMRS } from '../utils/functions/openmrs';

let bahmni: Bahmni;
let openmrs: OpenMRS;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);
  openmrs = new OpenMRS(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/clinical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
});

test('Starting a postnatal visit shows the patient in the Postnatal tab and updates the MSPP visit report', async ({ page, context }) => {
  let initialVisitsCount = 0;
  let updatedVisitsCount = 0;
  const newPage = await context.waitForEvent('page');

  await test.step('Get initial MSPP visit count from report', async () => {
    await page.goto(`${BAHMNI_URL}/openmrs`);
    await openmrs.navigateToReports();
    await openmrs.runMSPPVisitReport();
    await expect(page.getByRole('link', { name: /view report/i })).toBeVisible();
    await page.getByRole('link', { name: /view report/i }).click();


    await newPage.bringToFront();
    await expect(newPage.getByText('MSPP Visits Report').nth(0)).toBeVisible();
    const rawText = await newPage.locator('tr:has-text("Total") td:nth-of-type(2)').textContent();
    initialVisitsCount = Number(rawText?.trim());
  });

  await test.step('Register a patient and start a postnatal visit', async () => {
    await page.bringToFront();
    await page.goto(`${BAHMNI_URL}/bahmni/registration`);
    await bahmni.enterPatientDetails();
    await bahmni.startPostnatalVisit();
  });

  await test.step('Check patient appears in Postnatal tab', async () => {
    await page.goto(`${BAHMNI_URL}/bahmni/home`);
    await page.getByRole('link', { name: /clinical/i }).click();
    await expect(page.getByRole('link', { name: /postnatal/i })).toBeVisible();
    await page.getByRole('link', { name: /postnatal/i }).click();
    await page.locator('input[type="text"]').fill(`${patientName.givenName} ${patientName.familyName}`);
    await expect(page.locator('li.active-patient .patient-name', { hasText: `${patientName.givenName} ${patientName.familyName}` })).toBeVisible();
  });

  await test.step('Re-run MSPP report and validate count incremented', async () => {
    await page.goto(`${BAHMNI_URL}/openmrs`);
    await openmrs.navigateToReports();
    await openmrs.runMSPPVisitReport();
    await expect(page.getByRole('link', { name: /view report/i })).toBeVisible();
    await page.getByRole('link', { name: /view report/i }).click();

    await newPage.bringToFront();
    await expect(newPage.getByText(/MSPP Visits Report/).nth(0)).toBeVisible();
    const rawText = await newPage.locator('tr:has-text("Total") td:nth-of-type(2)').textContent();
    updatedVisitsCount = Number(rawText?.trim());

    await expect(updatedVisitsCount).toBe(initialVisitsCount + 1);
  });
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
