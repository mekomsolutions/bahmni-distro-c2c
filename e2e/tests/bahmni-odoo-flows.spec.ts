import { test, expect } from '@playwright/test';
import { Odoo } from '../utils/functions/odoo';
import { BAHMNI_URL, ODOO_URL } from '../utils/configs/globalSetup';
import { Bahmni, patientName } from '../utils/functions/bahmni';

let bahmni: Bahmni;
let odoo: Odoo;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);
  odoo = new Odoo(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/linical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/appointment scheduling/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
  await bahmni.registerPatient();
  await bahmni.goToHomePage();
});

test('Ordering a lab test for a Bahmni patient creates the corresponding Odoo customer with a filled quotation.', async ({ page }) => {
  // setup
  await bahmni.goToLabSamples();

  // replay
  await bahmni.createLabOrder();

  // verify
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);

  const statusSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(8) span");
  await expect(statusSelector).toHaveText("Devis");

  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  const labTest = await page.locator("tr:nth-child(1) td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier");
  await expect(labTest).toContainText('Malaria');
});


test('Editing the details of a Bahmni patient with a synced lab order edits the corresponding Odoo customer details.', async ({ page }) => {
  // setup
  await bahmni.goToLabSamples();
  await bahmni.createLabOrder();
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  const statusSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(8) span");
  await expect(statusSelector).toHaveText("Devis");

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.updatePatientDetails();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  const updatedCustomer = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(updatedCustomer).toHaveText(`${patientName.updatedGivenName}` + ' ' + `${patientName.familyName}`);
  await expect(statusSelector).toHaveText("Devis");
});

test('Revising a synced Bahmni lab order edits the corresponding Odoo quotation line.', async ({ page }) => {
  // setup
  await bahmni.goToLabSamples();
  await bahmni.createLabOrder();
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  const statusSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(8) span");
  await expect(statusSelector).toHaveText("Devis");
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  const labTest = await page.locator("td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span");
  await expect(labTest).toHaveText('Malaria');

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.goToLabSamples();
  await bahmni.reviseLabOrder();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(statusSelector).toHaveText("Devis");
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).first().click();
  await expect(labTest).not.toContainText('Malaria');
  await expect(labTest).toHaveText('Hematocrite');
});

test('Discontinuing a synced Bahmni lab order edits the corresponding Odoo quotation line.', async ({ page }) => {
  // setup
  await bahmni.goToLabSamples();
  await bahmni.createLabOrder();
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  const statusSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(8) span");
  await expect(statusSelector).toHaveText("Devis");
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  const labTest = await page.locator("td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span");
  await expect(labTest).toHaveText('Malaria');

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.goToLabSamples();
  await bahmni.discontinueLabOrder();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(statusSelector).toHaveText("Annulé");
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).first().click();
  await expect(page.getByText('Malaria')).not.toBeVisible();
});

test('Ordering a drug for a Bahmni patient creates the corresponding Odoo customer with a filled quotation.', async ({ page }) => {
  // setup
  await bahmni.goToMedications();

  // replay
  await bahmni.createMedication();

  // verify
  await odoo.open();
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);

  const statusSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(8) span");
  await expect(statusSelector).toHaveText("Devis");
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName}` }).click();
  const drugNameSelector = await page.locator("td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span");
  await expect(drugNameSelector).toContainText('Aspirine Co 81mg');
});


test('Editing the details of a Bahmni patient with a synced drug order edits the corresponding Odoo customer details.', async ({ page }) => {
  // setup
  await bahmni.goToMedications();
  await bahmni.createMedication();
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.updatePatientDetails();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  const updatedCustomer = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(updatedCustomer).toHaveText(`${patientName.updatedGivenName}` + ' ' + `${patientName.familyName}`);
});

test('Revising a synced OpenMRS drug order edits the corresponding Odoo quotation line.', async ({ page }) => {
  // setup
  await bahmni.goToMedications();
  await bahmni.createMedication();
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  const medicationDescrptionSelector = await page.locator("td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier span");
  const drugNameSelector = await page.locator("td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span");
  await expect(drugNameSelector).toContainText('Aspirine Co 81mg');
  await expect(medicationDescrptionSelector).toContainText('Aspirine Co 81mg | 560.0 Ampoule(s) | 2.0 Application(s) - Q3H - 5 Semaine(s)');

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.goToMedications();
  await bahmni.editMedicationDetails();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  await expect(drugNameSelector).toContainText('Aspirine Co 81mg');
  await expect(medicationDescrptionSelector).toContainText('Aspirine Co 81mg | 120.0 Comprime(s) | 4.0 Comprime(s) - Q4H - 5 Jour(s)');
});

test('Discontinuing a synced Bahmni drug order for an Odoo customer with a single quotation line removes the corresponding quotation.', async ({ page }) => {
  // setup
  await bahmni.goToMedications();
  await bahmni.createMedication();
  await odoo.open();
  await expect(page).toHaveURL(/.*web/);
  await odoo.searchCustomer();
  const customerSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(4)");
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  const statusSelector = await page.locator("tr.o_data_row:nth-child(1) td:nth-child(8) span");
  await expect(statusSelector).toHaveText("Devis");
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  const medicationDescrptionSelector = await page.locator("td.o_data_cell.o_field_cell.o_list_text.o_section_and_note_text_cell.o_required_modifier span");
  const drugNameSelector = await page.locator("td.o_data_cell.o_field_cell.o_list_many2one.o_product_configurator_cell.o_required_modifier>span");
  await expect(drugNameSelector).toContainText('Aspirine Co 81mg');
  await expect(medicationDescrptionSelector).toContainText('Aspirine Co 81mg | 560.0 Ampoule(s) | 2.0 Application(s) - Q3H - 5 Semaine(s)');

  // replay
  await page.goto(`${BAHMNI_URL}`);
  await bahmni.goToMedications();
  await bahmni.discontinueMedication();

  // verify
  await page.goto(`${ODOO_URL}`);
  await odoo.searchCustomer();
  await expect(customerSelector).toHaveText(`${patientName.givenName + ' ' + patientName.familyName}`);
  await expect(statusSelector).toHaveText('Annulé');
  await page.getByRole('cell', { name: `${patientName.givenName + ' ' + patientName.familyName }` }).click();
  await expect(page.getByText('Aspirine Co 81mg')).not.toBeVisible();
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
