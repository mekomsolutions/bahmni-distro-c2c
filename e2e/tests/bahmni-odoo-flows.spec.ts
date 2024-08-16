import { test, expect } from '@playwright/test';
import { Odoo } from '../utils/functions/odoo';
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
});

test('Ordering a lab test for a Bahmni patient creates the corresponding Odoo customer with a filled quotation.', async ({ page }) => {
  // setup
  await bahmni.registerPatient();

  // replay
  await bahmni.goToLabSamples();
  await page.getByText('Blood', { exact: true }).click();
  await page.getByText('Malaria').click();
  await bahmni.saveOrder();

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

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
