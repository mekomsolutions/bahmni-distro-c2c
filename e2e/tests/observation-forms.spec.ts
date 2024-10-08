import { test, expect } from '@playwright/test';
import { Bahmni, delay } from '../utils/functions/bahmni';

let bahmni: Bahmni;

test.beforeEach(async ({ page }) => {
  bahmni = new Bahmni(page);

  await bahmni.login();
  await expect(page.getByText(/registration/i)).toBeVisible();
  await expect(page.getByText(/clinical/i)).toBeVisible();
  await expect(page.getByText(/admin/i)).toBeVisible();
  await expect(page.getByText(/patient documents/i)).toBeVisible();
  await bahmni.registerPatient();
  await bahmni.navigateToPatientDashboard();
});

test('Anthropometry form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Anthropométrie')).toBeVisible();
  await page.getByRole('button', { name: 'Anthropométrie' }).click();
  await expect(page.getByText('Anthropométrie added successfully')).toBeVisible();

  // replay
  await bahmni.fillAnthropometryForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.locator('#observationSection h2')).toHaveText('Observations');
  await expect(page.locator('#observationSection').getByText('BMI Data')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('22.49')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('BMI Status Data')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Height')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('170')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Weight')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('65')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Head Circumference')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('23', { exact: true })).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Abdominal Diameter')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('25.5')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Mid-Upper Arm Circumference')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('24', {exact: true})).toBeVisible();
});

test('Gynecological ultrasound form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Echographie gynécologique')).toBeVisible();
  await page.getByRole('button', { name: 'Echographie gynécologique' }).click();
  await expect(page.getByText('Echographie gynécologique added successfully')).toBeVisible();

  // replay
  await bahmni.fillGynecologicalUltrasoundForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Echographie gynécologique')).toBeVisible();
  await expect(page.locator('div:nth-child(2) span.value-text-only').getByText('Normal left ovary. The right ovary contains a complex mass. No free fluid in the pelvis.')).toBeVisible();
});

test('Obstetric ultrasound 1 form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Echographie obstétricale 1')).toBeVisible();
  await page.getByRole('button', { name: 'Echographie obstétricale 1' }).click();
  await expect(page.getByText('Echographie obstétricale 1 added successfully')).toBeVisible();

  // replay
  await bahmni.fillObstetricUltrasound1Form();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Echographie obstétricale 1')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Confirmed Pregnancy')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Yes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Confirmed Gestational Age')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Weeks')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('9', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Days')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('64', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Location of pregnancy')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Ovarian Pregnancy')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Fetuses')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('2', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Placenta')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('2', {exact: true}).nth(1)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Localisation de Placenta')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Anterior')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fetal Heart Rate (120 - 160)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('155 beats/min')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Risky Pregnancy')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No').nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Identified complications')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No').nth(1)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other observations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('The two fetuses are growing well.')).toBeVisible();
});

test('Obstetric ultrasound 2 form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Echographie obstétricale 2')).toBeVisible();
  await page.getByRole('button', { name: 'Echographie obstétricale 2' }).click();
  await expect(page.getByText('Echographie obstétricale 2 added successfully')).toBeVisible();

  // replay
  await bahmni.fillObstetricUltrasound2Form();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Echographie obstétricale 2')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Fetuses')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('1', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Placenta')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('1', {exact: true}).nth(1)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fetus Details')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Localisation de Placenta')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Anterior')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fetal Heart Rate (120 - 160)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('150 beats/min')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Presentation')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Breech')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Arms')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Legs')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(1)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Brain')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(2)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Heart', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(3)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Lungs')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(4)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Kidneys')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Not Seen').nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Genitals')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Not Seen').nth(1)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fetal Sex')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Not Seen').nth(2)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other observations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('The fetus is about thirty two weeks.')).toBeVisible();
});

test('Obstetric ultrasound 3 form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Echographie obstétricale 3')).toBeVisible();
  await page.getByRole('button', { name: 'Echographie obstétricale 3' }).click();
  await expect(page.getByText('Echographie obstétricale 3 added successfully')).toBeVisible();

  // replay
  await bahmni.fillObstetricUltrasound3Form();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Echographie obstétricale 3')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Fetuses')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('2', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Placenta')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('2', {exact: true}).nth(1)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Localisation de Placenta')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Posterior')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Presentation')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Transverse')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other observations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('The two fetuses are in a good growing state.')).toBeVisible();
});

test('Physical examination form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Examen physique')).toBeVisible();
  await page.getByRole('button', { name: 'Examen physique' }).click();
  await expect(page.getByText('Examen physique added successfully')).toBeVisible();

  // replay
  await bahmni.fillPhysicalExaminationForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Examen physique')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('General Examination')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cardiovascular Examination', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Abnormal').nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cardiovascular Examination Details')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('The blood vessels are very narrow.')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Respiratory Examination')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Normal').nth(1)).toBeVisible()
});

test('Means of transportation form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Moyen de transport')).toBeVisible();
  await page.getByRole('button', { name: 'Moyen de transport' }).click();
  await expect(page.getByText('Moyen de transport added successfully')).toBeVisible();

  // replay
  await bahmni.fillMeansOfTransportationForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Moyen de transport')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Mode of Arrival', { exact: true })).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Minibus')).toBeVisible();
});

test('Family planning form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Planification familiale')).toBeVisible();
  await page.getByRole('button', { name: 'Planification familiale' }).click();
  await expect(page.getByText('Planification familiale added successfully')).toBeVisible();

  // replay
  await bahmni.fillFamilyPlanningForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Planification familiale')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('FP administred')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Depo Provera Injection')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Quantity Dispensed')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('3', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Type of user')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Existent')).toBeVisible();
});

test('Prenatal consultation form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Consultation prénatale')).toBeVisible();
  await page.getByRole('button', { name: 'Consultation prénatale' }).click();
  await expect(page.getByText('Consultation prénatale added successfully')).toBeVisible();

  // replay
  await bahmni.fillPrenatalConsultationForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Consultation prénatale')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Visit number')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Three')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Weeks')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('18', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Risky Pregnancy')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Signs and Symptoms', {exact:true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Abdominal pain')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Duration')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('3', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Day(s)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fetal Heart Rate (120 - 160)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('144 beats/min')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Presentation')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cephalic')).toBeVisible();
});

test('Reference form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Référence')).toBeVisible();
  await page.getByRole('button', { name: 'Référence' }).click();
  await expect(page.getByText('Référence added successfully')).toBeVisible();

  // replay
  await bahmni.fillReferenceForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Référence')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Referred By')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Doctor Fredric Hanandez')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Health Centre')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hopital St Jean Limbe')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Referral Notes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('The patient needs a CT scan due to pregnancy complications.')).toBeVisible();
});

test('New case of tuberculosis form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Nouveau cas de tuberculose')).toBeVisible();
  await page.getByRole('button', { name: 'Nouveau cas de tuberculose' }).click();
  await expect(page.getByText('Nouveau cas de tuberculose added successfully')).toBeVisible();

  // replay
  await bahmni.fillNewCaseOfTuberculosisForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Nouveau cas de tuberculose')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of contacts identified')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('16', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of contacts with symptoms')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('7', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Contact with positive TB case', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Yes', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of contact with positive TB cases')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('4', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Index case reference number')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('TB-250')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('BCG scar')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Invisible')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Anatomical site')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Pulmonary')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Treatment history')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Treatment after failure')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('TB Signs and symptoms')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Emanciation')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cough')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Loss of Appetite')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Evening fever')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('HIV Tested')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other observations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Test other findings.')).toBeVisible();
});

test('Triage form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Triage')).toBeVisible();
  await page.getByRole('button', { name: 'Triage' }).click();
  await expect(page.getByText('Triage added successfully')).toBeVisible();

  // replay
  await bahmni.fillTriageForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Triage', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Triage level')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Emergency')).toBeVisible();
});

test('Reason for consultation form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Motif de consultation')).toBeVisible();
  await page.getByRole('button', { name: 'Motif de consultation' }).click();
  await expect(page.getByText('Motif de consultation added successfully')).toBeVisible();

  // replay
  await bahmni.fillReasonForConsultationForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Motif de consultation', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Reason for Consultation', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Assault by animal suspected of rabies')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Details')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Had contact with a dog that had rabies.')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Duration')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('2', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Time Units')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Day(s)')).toBeVisible();
});

test('Unauthorized departure form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Départ non autorisé')).toBeVisible();
  await page.getByRole('button', { name: 'Départ non autorisé' }).click();
  await expect(page.getByText('Départ non autorisé added successfully')).toBeVisible();

  // replay
  await bahmni.fillUnauthorizedDepartureForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Départ non autorisé', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Left without permission')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Comments')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('The patient switched to using herbal medicine.')).toBeVisible();
});

test('Vital signs form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Signes vitaux')).toBeVisible();
  await page.getByRole('button', { name: 'Signes vitaux' }).click();
  await expect(page.getByText('Signes vitaux added successfully')).toBeVisible();

  // replay
  await bahmni.fillVitalSignsForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Signes vitaux', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Vital Signs')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Pain Scale')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('8', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Pulse (60 - 160)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('136 beats/min', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('T (36.7 - 37.5)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('37.2 C', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('RR (12 - 70)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('55 breaths/min', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('SaO2 (95 - 100)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('97 %', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Blood Pressure')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Systolic (90 - 120)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('115 mmHg', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Diastolic (60 - 80)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('75 mmHg', {exact: true}).nth(0)).toBeVisible();
});

test('Gynecological examination form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Examen gynécologique')).toBeVisible();
  await page.getByRole('button', { name: 'Examen gynécologique' }).click();
  await expect(page.getByText('Examen gynécologique added successfully')).toBeVisible();

  // replay
  await bahmni.fillGynecologicalExaminationForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Examen gynécologique', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Age at Menarche')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('14 Years')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Date of last period')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('15 Sep 24')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Total Number of Pregnancies (Gravidity)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('5', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of abortions')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('0', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Number of Term Pregnancies')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('3', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Gyn complaint', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Breast problems')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Use of contraception')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Yes', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Contraception', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Microgynon (plaquette)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Date', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('16 Sep 23')).toBeVisible();
});

test('Emergency monitoring form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Suivi d’urgences')).toBeVisible();
  await page.getByRole('button', { name: 'Suivi d’urgences' }).click();
  await expect(page.getByText('Suivi d’urgences added successfully')).toBeVisible();

  // replay
  await bahmni.fillEmergencyMonitoringForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Suivi d’urgences')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Date/Time')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('19 Aug 24 4:30 pm')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Action taken')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Patient put on oxygen.')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other observations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Patient recovered from stroke.')).toBeVisible();
});

test('Vaccinations form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await page.getByPlaceholder('Search Obs Form').type('Vaccinations');
  await expect(page.getByText('Vaccinations', {exact: true})).toBeVisible();
  await page.getByRole('button', { name: 'Vaccinations' }).click();
  await expect(page.getByText('Vaccinations added successfully')).toBeVisible();

  // replay
  await bahmni.fillVaccinationsForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Vaccinations', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Pentavalent Vaccination')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Sequence number', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('383', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Vaccination date')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('13 Sep 24')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Vaccine Lot Number')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('VLN-26')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fully vaccinated')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Yes', {exact: true}).nth(0)).toBeVisible();
});

test('Nutrition form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Nutrition', {exact: true})).toBeVisible();
  await page.getByRole('button', { name: 'Nutrition' }).click();
  await expect(page.getByText('Nutrition added successfully')).toBeVisible();

  // replay
  await bahmni.fillNutritionForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Nutrition', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('First Visit')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Malnutrition Signs and symptoms', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Vomiting')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Duration')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Time Units')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('4', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hour(s)')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Grade of edema')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('++')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Chest Indrawing')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Signs of dehydration')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Moderate')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('State of consciousness')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Passive')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Extremities')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Appearance of the ears')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Ear Discharge')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Oral appearance')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Oral thrush')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Skin appearance')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Scabies')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Lymph Nodes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Inguinal fold')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Appetite')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Good')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other Problems')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No', {exact: true}).nth(2)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Result of the visit')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Follow-up appointment')).toBeVisible();
});

test('Systems review form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Examen des systèmes', {exact: true})).toBeVisible();
  await page.getByRole('button', { name: 'Examen des systèmes' }).click();
  await expect(page.getByText('Examen des systèmes added successfully')).toBeVisible();

  // replay
  await bahmni.fillSystemsReviewForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Examen des systèmes', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('General Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Night sweats')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Fatigue')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Loss of Appetite')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Skin Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Rashes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dermatological pruritus')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Discolorations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Head Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Headache')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dizziness')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Mass')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Tongue')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Platypnea')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Ears Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Ear Discharge')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Deaf')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Eyes Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Eye itching')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Discharge from the eyes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Conjuctivitis')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Teary eyes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Visual disturbance')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Nose Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Nose Discharge')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Bleeding')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Sinus Congestion')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Mouth and Throat Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Missing')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dysphagia')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Pallet')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Respiratory Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cough')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Orthopnea')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hemoptysis')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cardiovascular Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Chest Pain')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Lower Extremity Edema')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Paroxysmal Nocturnal Dyspnea')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dyspnea with Exertion')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Palpitations')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Gastrointestinal', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dyschezia')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Abdominal pain')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hematemesis')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Constipation')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hematochezia')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Genitourinary Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hesitation')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dysuria')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Polyuria')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Endocrine Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Heat Intolerance')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hair Problem')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Dry Skin')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Musculoskeletal Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Joint Deformity')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Left arm')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Skin and Lymphatic Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Lymphadenopathy')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Under the jaw and chin')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Neuropsychiatric and Psychomotor Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Memory loss')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Anxiety')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Language Disorder')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Self Care Skill Deficiency')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Motor Skills Disorder')).toBeVisible();
});

test('Health history form should save observations.', async ({ page }) => {
  // setup
  await bahmni.navigateToForms();
  await expect(page.getByText('Historique de santé', {exact: true})).toBeVisible();
  await page.getByRole('button', { name: 'Historique de santé' }).click();
  await expect(page.getByText('Historique de santé added successfully')).toBeVisible();

  // replay
  await bahmni.fillHealthHistoryForm();

  // verify
  await bahmni.navigateToVisitsDashboard();
  await expect(page.getByText('Historique de santé', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Insect bites and stings')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Reason', {exact: true}).first()).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Allergic to insect bites and strings')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Duration')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Time Units')).toBeVisible()
  await expect(page.locator('#observationSection').getByText('6', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Month(s')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Health Centre')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hopital Sacré Coeur Milot')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Current Medication', {exact:true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No', {exact: true}).nth(0)).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Self Medication', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Oral antihistamines')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Personal History', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Asthma')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hypertension')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Mental illness')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Cancer')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Hepatitis')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Type 1 diabetes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Family History', {exact: true})).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Type 2 diabetes')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Tuberculosis')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Sickle-cell anemia')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('History of Trauma')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('No Trauma history')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Past Surgical History')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Colorectal surgery')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Use of alcohol')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Tobacco History Set')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Tobacco use')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Marijuana')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Other Substance')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Heterosexual')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('Age at first intercourse')).toBeVisible();
  await expect(page.locator('#observationSection').getByText('26', {exact: true}).nth(0)).toBeVisible();
});

test.afterEach(async ({ page }) => {
  await bahmni.voidPatient();
  await page.close();
});
