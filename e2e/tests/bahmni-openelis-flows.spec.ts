import { test, expect } from '@playwright/test';
import { BAHMNI_URL } from '../utils/configs/globalSetup';
import { Bahmni, delay, patientName } from '../utils/functions/bahmni';
import { OpenELIS } from '../utils/functions/openelis';

let bahmni: Bahmni;
let openelis: OpenELIS;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);
  openelis = new OpenELIS(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/clinical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.enterPatientDetails();
  await bahmni.startPatientVisit();
  await bahmni.navigateToPatientDashboard();
});

test('Ordering a lab test for a Bahmni patient creates the corresponding OpenElis client with an analysis request.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();

  // replay
  await bahmni.createLabOrder();

  // verify
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await page.locator('#todaySamplesToCollectListContainer-slick-grid div.slick-viewport div.slick-cell.l6.r6.cell-title a').click();
  await expect(page.locator('#tests_1')).toHaveValue('Malaria')
});

test('Editing the details of a Bahmni patient with a synced lab order edits the corresponding OpenELIS client details.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.updatePatientDetails();

  // verify
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.updatedGivenName}` + ' ' + `${patientName.familyName}`);
});

test('Revising a synced Bahmni lab order edits the corresponding OpenELIS client analysis request.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await page.locator('#todaySamplesToCollectListContainer-slick-grid div.slick-viewport div.slick-cell.l6.r6.cell-title a').click();
  await expect(page.locator('#tests_1')).toHaveValue('Malaria')

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToLabSamples();
  await bahmni.reviseLabOrder();

  // verify
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await page.locator('#todaySamplesToCollectListContainer-slick-grid div.slick-viewport div.slick-cell.l6.r6.cell-title a').click();
  await expect(page.locator('#tests_1')).toHaveValue('Hematocrite');
});

test('Voiding a synced OpenMRS lab order cancels the corresponding OpenElis analysis request.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await page.locator('#todaySamplesToCollectListContainer-slick-grid div.slick-viewport div.slick-cell.l6.r6.cell-title a').click();
  await expect(page.locator('#tests_1')).toHaveValue('Malaria')

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToLabSamples();
  await bahmni.discontinueLabOrder();

  // verify
  await openelis.open();
  await openelis.searchClient();
  await expect(page.getByText(`${patientName.givenName + ' ' + patientName.familyName}`)).not.toBeVisible();
});

test('Published coded lab results from OpenELIS are viewable in the Bahmni lab results viewer.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();

  // replay
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await openelis.collectSample();
  await page.locator('a#todaySamplesCollectedListContainerId').click();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await openelis.enterCodedResults();
  await page.locator('a#todaySamplesCollectedListContainerId').click();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await openelis.validateLabResults();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await expect(page.locator('#todaySamplesCollectedListContainer-slick-grid div.slick-viewport div div:nth-child(1) div.slick-cell.l8.r8.cell-title')).toHaveText('Yes');

  // verify
  await bahmni.navigateToPatientDashboard();
  await expect(page.locator('#Lab-Results').getByText('Malaria')).toBeVisible();
  await expect(page.locator('#Lab-Results span.value')).toHaveText('Negatif');
});

test('Published numerical lab results from OpenELIS are viewable in the Bahmni lab results viewer.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await page.getByText('Blood', { exact: true }).click();
  await page.getByText('Lymphocites').click();
  await bahmni.save();
  await delay(5000);

  // replay
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await openelis.collectSample();
  await page.locator('a#todaySamplesCollectedListContainerId').click();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await openelis.enterNumericalResults();
  await page.locator('a#todaySamplesCollectedListContainerId').click();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await openelis.validateLabResults();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await expect(page.locator('#todaySamplesCollectedListContainer-slick-grid div.slick-viewport div div:nth-child(1) div.slick-cell.l8.r8.cell-title')).toHaveText('Yes');

  // verify
  await bahmni.navigateToPatientDashboard();
  await expect(page.locator('#Lab-Results').getByText('Lymphocytes')).toBeVisible();
  await expect(page.locator('#Lab-Results span.value')).toHaveText('13.7');
});

test('Published free text lab results from OpenELIS are viewable in the Bahmni lab results viewer.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await page.getByText('Urine', { exact: true }).click();
  await page.getByText('Urobilinogen').click();
  await bahmni.save();
  await delay(5000);

  // replay
  await openelis.open();
  await openelis.searchClient();
  await expect(page.locator("#todaySamplesToCollectListContainer-slick-grid div.slick-cell.l1.r1")).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await openelis.collectSample();
  await page.locator('a#todaySamplesCollectedListContainerId').click();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await openelis.enterFreeTextResults();
  await page.locator('a#todaySamplesCollectedListContainerId').click();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await openelis.validateLabResults();
  await page.locator('#todaySamplesCollectedListContainer-slick-grid div.ui-state-default.slick-headerrow-column.l2.r2 input[type=text]').type(`${patientName.familyName}`);
  await expect(page.locator('#todaySamplesCollectedListContainer-slick-grid div.slick-viewport div div:nth-child(1) div.slick-cell.l8.r8.cell-title')).toHaveText('Yes');

  // verify
  await bahmni.navigateToPatientDashboard();
  await expect(page.locator('#Lab-Results').getByText('Urobilinogen')).toBeVisible();
  await expect(page.locator('#Lab-Results span.value')).toHaveText('Abnormal level');
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
