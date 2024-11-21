
import { test, expect } from '@playwright/test';
import { Bahmni, patientName } from '../utils/functions/bahmni';
import { BAHMNI_URL } from '../utils/configs/globalSetup';

let bahmni: Bahmni;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);
});

test('Register and edit a patient.', async ({ page }) => {
  // setup
  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/clinical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();

  // replay
  await bahmni.registerPatient();

  // verify creation
  await bahmni.navigateToPatientDashboard();
  await expect(page.locator('#patientContext span:nth-child(2)')).toContainText(`${patientName.givenName + ' ' + patientName.familyName}`)

  // verify revision
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.navigateToPatientRegistationForm();
  await bahmni.updatePatientDetails();
  await bahmni.navigateToPatientDashboard();
  await expect(page.locator('#patientContext span:nth-child(2)')).toContainText(`${patientName.updatedGivenName}` + ' ' + `${patientName.familyName}`)
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
