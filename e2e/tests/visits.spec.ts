import { test, expect } from '@playwright/test';
import { BAHMNI_URL } from '../utils/configs/globalSetup';
import { Bahmni, patientName } from '../utils/functions/bahmni';
import { OpenMRS } from '../utils/functions/openmrs';

let bahmni: Bahmni;
let openmrs: OpenMRS;

test.use({ video: 'on' });

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);
  openmrs = new OpenMRS(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/clinical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
});

test('Starting a postnatal visit shows the patient in the Postnatal tab and updates the MSPP visit report', async ({ page }) => {
  // setup
  await page.goto(`${BAHMNI_URL}/openmrs`);
  await openmrs.navigateToReports();
  await openmrs.runMSPPVisitReport();
  await expect(page.getByText('View Report')).toBeVisible();
  await page.goto(`${BAHMNI_URL}/openmrs/module/reporting/reports/renderDefaultReport.form`);
  await expect(page.locator('a[href="#tabs-0"]').getByText('MSPP Visits Report')).toBeVisible();
  let initialVisitsCount = Number(await page.locator('tr.alt', {has: page.getByText('Total')}).locator('td:nth-of-type(2)').textContent());

  // replay
  await page.goto(`${BAHMNI_URL}/bahmni/registration`);
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.enterPatientDetails();
  await bahmni.startPostnatalVisit();
  await page.goto(`${BAHMNI_URL}/bahmni/home`);
  await page.getByRole('link', { name: 'Clinical' }).click();
  await expect(page.getByRole('link', { name: 'Postnatal' })).toBeVisible();
  await page.getByRole('link', { name: 'Postnatal' }).click();

  // verify
  await expect(page.locator('li.active-patient .patient-name', { hasText: `${patientName.givenName + ' ' + patientName.familyName}` })).toBeVisible();
  await page.goto(`${BAHMNI_URL}/openmrs`);
  await openmrs.navigateToReports();
  await openmrs.runMSPPVisitReport();
  await page.goto(`${BAHMNI_URL}/openmrs/module/reporting/reports/renderDefaultReport.form`);
  await expect(page.locator('a[href="#tabs-0"]').getByText('MSPP Visits Report')).toBeVisible();
  let updatedVisitsCount = Number(await page.locator('tr.alt', {has: page.getByText('Total')}).locator('td:nth-of-type(2)').textContent());
  await expect(initialVisitsCount).toBe(updatedVisitsCount + 1);
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
