import { test, expect } from '@playwright/test';
import { BAHMNI_URL, ODOO_URL } from '../utils/configs/globalSetup';
import { Odoo } from '../utils/functions/odoo';
import { Bahmni, patientName } from '../utils/functions/bahmni';

let odoo: Odoo;
let bahmni: Bahmni;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);
  odoo = new Odoo(page);

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

test('Ordering a lab test for a Bahmni patient creates the corresponding Odoo customer with a filled quotation.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();

  // replay
  await bahmni.createLabOrder();

  // verify
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');

  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  await expect(page.locator('tr:nth-child(1) td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier')).toContainText('Malaria');
});

test('Editing the details of a Bahmni patient with a synced lab order edits the corresponding Odoo customer details.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.updatePatientDetails();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.updatedGivenName}` + ' ' + `${patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');
});

test('Revising a synced Bahmni lab order edits the corresponding Odoo quotation line.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toHaveText('Malaria');

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToLabSamples();
  await bahmni.reviseLabOrder();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).first().click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).not.toHaveText('Malaria');
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toHaveText('Hematocrite');
});

test('Discontinuing a synced Bahmni lab order edits the corresponding Odoo quotation line.', async ({ page }) => {
  // setup
  await bahmni.navigateToLabSamples();
  await bahmni.createLabOrder();
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toHaveText('Malaria');

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToLabSamples();
  await bahmni.discontinueLabOrder();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Cancelled');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).first().click();
  await expect(page.getByText('Malaria')).not.toBeVisible();
});

test('Ordering a drug for a Bahmni patient creates the corresponding Odoo customer with a filled quotation.', async ({ page }) => {
  // setup
  await bahmni.navigateToMedications();

  // replay
  await bahmni.createMedication();

  // verify
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toContainText('Aspirine Co 81mg');
});


test('Editing the details of a Bahmni patient with a synced drug order edits the corresponding Odoo customer details.', async ({ page }) => {
  // setup
  await bahmni.navigateToMedications();
  await bahmni.createMedication();

  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.navigateToPatientRegistationPage();
  await bahmni.updatePatientDetails();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.updatedGivenName}` + ' ' + `${patientName.familyName}`);
});

test('Revising a synced OpenMRS drug order edits the corresponding Odoo quotation line.', async ({ page }) => {
  // setup
  await bahmni.navigateToMedications();
  await bahmni.createMedication();
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toContainText('Aspirine Co 81mg');
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier span')).toContainText('Aspirine Co 81mg | 40.0 Comprime(s) | 1.0 Comprime(s) - Q3H - 5 Jour(s)');

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToMedications();
  await bahmni.editMedicationDetails();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toContainText('Aspirine Co 81mg');
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier span')).toContainText('Aspirine Co 81mg | 60.0 Comprime(s) | 2.0 Comprime(s) - Q4H - 5 Jour(s)');
});

test('Discontinuing a synced Bahmni drug order for an Odoo customer with a single quotation line removes the corresponding quotation.', async ({ page }) => {
  // setup
  await bahmni.navigateToMedications();
  await bahmni.createMedication();
  await odoo.open();
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Quotation');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span')).toContainText('Aspirine Co 81mg');
  await expect(page.locator('td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier span')).toContainText('Aspirine Co 81mg | 40.0 Comprime(s) | 1.0 Comprime(s) - Q3H - 5 Jour(s)');

  // replay
  await bahmni.navigateToPatientDashboard();
  await bahmni.navigateToMedications();
  await bahmni.discontinueMedication();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(4)')).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(page.locator('tr.o_data_row:nth-child(1) td:nth-child(8) span')).toHaveText('Cancelled');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  await expect(page.getByText('Aspirine Co 81mg')).not.toBeVisible();
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
