import { Page, expect } from '@playwright/test';
import { BAHMNI_URL } from '../configs/globalSetup';

export var patientName = {
  givenName : '',
  familyName : '',
  updatedGivenName: '',
}

export const delay = (mills) => {
  let datetime1 = new Date().getTime();
  let datetime2 = datetime1 + mills;
  while(datetime1 < datetime2) {
     datetime1 = new Date().getTime();
    }
}

export class Bahmni {
  constructor(readonly page: Page) {}

  async login() {
    await this.page.goto(`${BAHMNI_URL}`)
    await this.page.locator('#username').fill(`${process.env.BAHMNI_USERNAME}`);
    await this.page.locator('#password').fill(`${process.env.BAHMNI_PASSWORD}`);
    await this.page.locator('#location').selectOption('object:7');
    await this.page.getByRole('button', { name: /login/i }).click();
    await expect(this.page).toHaveURL(/.*home/);
  }

  async registerPatient() {
    patientName = {
      givenName : `e2e_test_${Array.from({ length: 4 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
      familyName : `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`, 
      updatedGivenName : `${Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('')}`,
    }
    await this.page.goto(`${BAHMNI_URL}/bahmni/registration`);
    await this.page.locator('a').filter({ hasText: /create new/i }).click();
    await this.page.locator('#givenName').fill(`${patientName.givenName}`);
    await this.page.locator('#familyName').fill(`${patientName.familyName}`);
    await this.page.locator('#gender').selectOption('F');
    await this.page.locator('#ageYears').fill(`${Math.floor(Math.random() * 99)}`);
    await this.page.locator('#view-content div>ul>li button').click();
    await expect(this.page.getByRole('button', { name: /save/i })).toBeEnabled();
    await this.page.getByRole('button', { name: /priority/i }).click();
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText('error')).not.toBeVisible();
  }

  async searchPatient() {
    await this.page.locator('#patientIdentifier').fill(`${patientName.familyName}`);
    await this.page.getByText(`${patientName.givenName + ' ' + patientName.familyName}`).click();
  }

  async updatePatientDetails() {
    await this.page.getByRole('link', { name: /registration/i }).click();
    await this.page.locator('#name').fill(`${patientName.familyName}`);
    await this.page.locator('form[name="searchByNameForm"]').getByRole('button', { name: /search/i }).click();
    await this.page.locator('#view-content td:nth-child(1) a').click();
    await expect(this.page.locator('#givenName')).toBeVisible();
    await this.page.locator('#givenName').clear();
    await delay(1000);
    await this.page.locator('#givenName').fill(`${patientName.updatedGivenName}`);
    await this.page.getByRole('button', { name: /save/i }).click();
    patientName.givenName = `${patientName.updatedGivenName}`;
    await delay(6000);
  };

  async voidPatient() {
    await this.page.goto(`${BAHMNI_URL}/openmrs/admin/patients/index.htm`);
    await expect(this.page.getByPlaceholder(' ')).toBeVisible();
    await this.page.getByPlaceholder(' ').type(`${patientName.familyName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Void patient created by smoke test');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();
    await expect(this.page.locator('//*[@id="patientFormVoided"]')).toContainText(/this patient has been deleted/i);
  }

  async navigateToLabSamples() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.locator('#opd-tabs').getByText(/orders/i).click();
    await expect(this.page.getByText(/lab samples/i)).toBeVisible();
  }

  async createLabOrder() {
    await this.page.getByText('Blood', { exact: true }).click();
    await this.page.getByText('Malaria').click();
    await this.save();
  }

  async reviseLabOrder() {
    await this.page.getByText('Blood', { exact: true }).click();
    await this.page.locator('#selected-orders li').filter({ hasText: 'Malaria' }).locator('i').nth(1).click();
    await this.page.getByText(/hematocrit/i).click();
    await this.save();
  }

  async discontinueLabOrder() {
    await this.page.getByText('Blood', { exact: true }).click();
    await this.page.locator('#selected-orders li').filter({ hasText: 'Malaria' }).locator('i').nth(1).click();
    await this.save();
  }

  async navigateToPatientDashboard() {
    await this.page.goto(`${BAHMNI_URL}/bahmni/home`);
    await this.page.getByRole('link', { name: 'Clinical' }).click();
    await this.searchPatient();
  }

  async navigateToForms() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await expect(this.page.getByRole('button', { name: /add new obs form/i })).toBeVisible();
    await this.page.getByRole('button', { name: /add new obs form/i  }).click();
  }

  async navigateToDiagnosis() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.locator('#opd-tabs').getByText(/diagnosis/i).click();
  }

  async navigateToMedications() {
    await this.page.locator('#view-content :nth-child(1).btn--success').click();
    await this.page.locator('#opd-tabs').getByText(/medications/i).click();
    await expect(this.page.getByText(/order drug/i)).toBeVisible();
    await expect(this.page.getByText(/order an order set/i)).toBeVisible();
  }

  async createMedication() {
    await this.page.locator('#drug-name').type('Aspirine Co 81mg');
    await this.page.getByText('Aspirine Co 81mg (Comprime)').click();
    await this.page.locator('#uniform-dose').fill('2');
    await this.page.locator('#uniform-dose-unit').selectOption('string:Application(s)');
    await this.page.locator('#frequency').selectOption('string:Q3H');
    await this.page.locator('#route').selectOption('string:Topique');
    await this.page.locator('#duration').fill('5');
    await this.page.locator('#duration-unit').selectOption('string:Semaine(s)');
    await this.page.locator('#total-quantity-unit').selectOption('string:Ampoule(s)');
    await this.page.locator('#instructions').selectOption('string:Estomac vide');
    await this.page.locator('#additional-instructions').fill('Take after a meal');
    await expect(this.page.locator('#quantity')).toHaveValue('560');
    await this.page.getByRole('button', { name: /add/i }).click();
    await this.save();
  }

  async editMedicationDetails() {
    await this.page.locator('i.fa.fa-edit').first().click();
    await this.page.locator('#uniform-dose').clear();
    await this.page.locator('#uniform-dose').fill('4');
    await this.page.locator('#frequency').selectOption('string:Q4H');
    await this.page.locator('#uniform-dose-unit').selectOption('string:Comprime(s)');
    await this.page.locator('#route').selectOption('string:Inhalation');
    await this.page.getByRole('button', { name: /add/i }).click();
    await this.save();
  }

  async discontinueMedication() {
    await this.page.getByRole('button', { name: /stop/i }).first().click();
    await this.page.getByPlaceholder('Notes').fill('Patient allergic to medicine');
    await this.save();
    await this.page.locator('#dashboard-link span.patient-name').click();
    await expect(this.page.locator('#dashboard-treatments span.discontinued-text').first()).toContainText('Stopped');
  }


  async fillAnthropometryForm() {
    await this.page.locator('input[type=number]').nth(0).fill('170');
    await this.page.locator('input[type=number]').nth(1).fill('65');
    await this.page.locator('input[type=number]').nth(2).fill('23');
    await this.page.locator('input[type=number]').nth(3).fill('25.5');
    await this.page.locator('input[type=number]').nth(4).fill('24');
    await this.save();
  }

  async fillGynecologicalUltrasoundForm() {
    await expect(this.page.locator('div.obs-control-field textarea')).toBeVisible();
    await this.page.locator('div.obs-control-field textarea').fill('Normal left ovary. The right ovary contains a complex mass. No free fluid in the pelvis.');
    await this.save();
  }

  async fillObstetricUltrasound1Form() {
    await expect(this.page.locator('span.section-label')).toHaveText('Echographie obstétricale 1');
    await this.page.getByRole('button', { name: 'Yes' }).first().click();
    await this.page.locator('.fl input').nth(0).fill('9');
    await this.page.locator('.fl input').nth(1).fill('64');
    await this.page.getByRole('button', { name: 'Ovarian Pregnancy' }).click();
    await this.page.locator('.fl input').nth(2).fill('2');
    await this.page.locator('.fl input').nth(3).fill('2');
    await this.page.locator('.fl input').nth(4).fill('155');
    await this.page.getByRole('button', { name: 'Anterior' }).click();
    await this.page.getByRole('button', { name: 'No' }).nth(1).click();
    await this.page.getByRole('button', { name: 'No' }).nth(2).click();
    await this.page.locator('div textarea').fill('The two fetuses are growing well.');
    await this.save();
  }

  async fillObstetricUltrasound2Form() {
    await this.page.locator('.fl input').nth(0).fill('1');
    await this.page.locator('.fl input').nth(1).fill('1');
    await this.page.getByRole('button', { name: 'Anterior' }).click();
    await this.page.locator('.fl input').nth(2).fill('150');
    await this.page.getByRole('button', { name: 'Breech' }).click();
    await this.page.locator(':nth-child(4)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(1)').first().click();
    await this.page.locator(':nth-child(5)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(1)').first().click();
    await this.page.locator(':nth-child(6)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(1)').first().click();
    await this.page.locator(':nth-child(7)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(1)').first().click();
    await this.page.locator(':nth-child(8)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(1)').first().click();
    await this.page.locator(':nth-child(9)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(3)').first().click();
    await this.page.locator(':nth-child(10)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(3)').first().click();
    await this.page.locator(':nth-child(11)>.form-builder-column-wrapper>.form-builder-column>.form-field-wrap>.form-field-content-wrap button:nth-child(3)').first().click();
    await this.page.locator('div textarea').fill('The fetus is about thirty two weeks.');
    await this.save();
  }

  async fillObstetricUltrasound3Form() {
    await expect(this.page.locator('div.obs-control-field textarea')).toBeVisible();
    await this.page.locator('.fl input').nth(0).fill('2');
    await this.page.locator('.fl input').nth(1).fill('2');
    await this.page.getByRole('button', { name: 'Posterior' }).click();
    await this.page.getByRole('button', { name: 'Transverse' }).click();
    await this.page.getByRole('textbox').fill('The two fetuses are in a good growing state.');
    await this.save();
  }

  async fillPhysicalExaminationForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Examen physique');
    await this.page.locator(':nth-child(3)>.form-builder-column-wrapper button').first().click();
    await this.page.locator(':nth-child(7)>.form-builder-column-wrapper :nth-child(2)').nth(1).click();
    await expect(this.page.getByText('Cardiovascular Examination Details')).toBeVisible();
    await expect(this.page.locator('div textarea')).toBeVisible();
    await this.page.locator('div textarea').fill('The blood vessels are very narrow.');
    await this.page.locator(':nth-child(9)>.form-builder-column-wrapper button').first().click();
    await this.save();
  }

  async fillMeansOfTransportationForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Moyen de transport');
    await this.page.getByRole('button', { name: 'Minibus' }).click();
    await this.save();
  }

  async fillFamilyPlanningForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Planification familiale');
    await this.page.getByRole('button', { name: 'Depo Provera Injection' }).click();
    await this.page.locator('input[type=number]').fill('3');
    await this.page.getByRole('button', { name: 'Existent' }).click();
    await this.save();
  }

  async fillPrenatalConsultationForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Consultation prénatale');
    await this.page.getByRole('button', { name: 'Three' }).click();
    await this.page.locator('input[type=number]').nth(0).fill('18');
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('group', { name: 'Signs and Symptoms' }).locator('span').nth(1).click();
    await this.page.getByRole('option', { name: 'Abdominal pain' }).click();
    await this.page.getByRole('group', { name: 'Signs and Symptoms' }).getByRole('spinbutton').fill('3');
    await this.page.getByRole('button', { name: 'Day(s)' }).click();
    await this.page.getByRole('group', { name: 'Fetus Details' }).getByRole('spinbutton').fill('144');
    await this.page.getByRole('button', { name: 'Cephalic' }).click();
    await this.save();
  }

  async fillReferenceForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Référence');
    await this.page.locator('div textarea').nth(0).fill('Doctor Fredric Hanandez');
    await this.page.getByRole('button', { name: 'Hopital St Jean Limbe' }).click();
    await this.page.locator('div textarea').nth(1).fill('The patient needs a CT scan due to pregnancy complications.');
    await this.save();
  }

  async fillTriageForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Triage');
    await this.page.getByRole('button', { name: 'Emergency' }).click();
    await this.save();
  }

  async fillReasonForConsultationForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Motif de consultation');
    await this.page.getByRole('combobox').type('Assault by animal suspected of rabies');
    await this.page.getByRole('option', { name: 'Assault by animal suspected of rabies' }).click();
    await this.page.getByRole('textbox').fill('Had contact with a dog that had rabies.');
    await this.page.locator('input[type=number]').fill('2');
    await this.page.getByRole('button', { name: 'Day(s)' }).click();
    await this.save();
  }

  async fillUnauthorizedDepartureForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Départ non autorisé');
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.locator('div textarea').fill('The patient switched to using herbal medicine.');
    await this.save();
  }

  async fillVitalSignsForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Signes vitaux');
    await this.page.locator('input[type=number]').nth(0).fill('8');
    await this.page.locator('input[type=number]').nth(1).fill('136');
    await this.page.locator('input[type=number]').nth(2).fill('37.2');
    await this.page.locator('input[type=number]').nth(3).fill('55');
    await this.page.locator('input[type=number]').nth(4).fill('97');
    await this.page.locator('input[type=number]').nth(5).fill('115');
    await this.page.locator('input[type=number]').nth(6).fill('75');
    await this.save();
  }

  async fillGynecologicalExaminationForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Examen gynécologique');
    await this.page.locator('input[type=number]').nth(0).fill('14');
    await this.page.locator('input[type=date]:nth-child(1)').type('09-15-2024');
    await this.page.locator('input[type=number]').nth(1).fill('5');
    await this.page.locator('input[type=number]').nth(2).fill('0');
    await this.page.locator('input[type=number]').nth(3).fill('3');
    await this.page.getByRole('button', { name: 'Breast problems' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();
    await expect(this.page.getByText('Contraception', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Date', { exact: true })).toBeVisible();
    await this.page.getByRole('button', { name: 'Microgynon (plaquette)' }).click();
    await this.page.locator('input[type=date]:nth-child(1)').nth(1).type('09-16-2023');
    await this.save();
  }

  async fillTBMonitoringForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Suivi TB');
    await this.page.getByRole('button', { name: 'Cough' }).click();
    await this.page.getByRole('button', { name: 'Evening fever' }).click();
    await this.page.getByRole('button', { name: 'Loss of appetite' }).click();
    await this.page.getByRole('button', { name: 'Weight Loss' }).click();
    await this.page.locator('div textarea').nth(0).fill('Conduct bacteriologic examination of patient\'s sputum or other specimens.');
    await this.save();
  }

  async fillNewCaseOfTuberculosisForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Nouveau cas de tuberculose');
    await this.page.locator('input[type=number]').nth(0).fill('16');
    await this.page.locator('input[type=number]').nth(1).fill('7');
    await this.page.getByRole('button', { name: 'Yes' }).first().click();
    await this.page.locator('input[type=number]').nth(2).fill('4');
    await this.page.getByRole('textbox').first().fill('TB-250');
    await this.page.getByRole('button', { name: 'Invisible' }).click();
    await this.page.getByRole('button', { name: 'Pulmonary', exact: true }).click();
    await this.page.getByRole('button', { name: 'Treatment after failure' }).click();
    await this.page.getByRole('button', { name: 'Cough' }).click();
    await this.page.getByRole('button', { name: 'Evening fever' }).click();
    await this.page.getByRole('button', { name: 'Loss of appetite' }).click();
    await this.page.getByRole('button', { name: 'Hemoptysis' }).click();
    await this.page.getByRole('button', { name: 'Emanciation' }).click();
    await this.page.getByRole('button', { name: 'No' }).nth(3).click();
    await this.page.locator('div textarea').nth(1).fill('Test other findings.');
    await this.save();
  }

  async fillEmergencyMonitoringForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Suivi d’urgences');
    await this.page.locator('input[type=date]:nth-child(1)').type('08-19-2024');
    await this.page.locator('input[type=time]:nth-child(2)').fill('16:30');
    await this.page.locator('div textarea').nth(0).fill('Patient put on oxygen.');
    await this.page.locator('div textarea').nth(1).fill('Patient recovered from stroke.');
    await this.save();
  }

  async fillVaccinationsForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Vaccinations');
    await this.page.getByRole('button', { name: 'Pentavalent Vaccination' }).click();
    await this.page.locator('input[type=number]').fill('383');
    await this.page.getByRole('button', { name: 'True' }).first().click();
    await this.page.locator('input[type=date]:nth-child(1)').type('09-13-2024');
    await this.page.locator('div textarea').fill('VLN-26');
    await this.page.getByRole('button', { name: 'True' }).nth(1).click();
    await this.save();
  }

  async fillNutritionForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Nutrition');
    await this.page.getByRole('button', { name: 'No' }).first().click();
    await this.page.getByRole('button', { name: 'Vomiting' }).click();
    await this.page.locator('input[type=number]').nth(0).fill('4');
    await this.page.getByRole('button', { name: 'Hour(s)' }).click();
    await this.page.getByRole('button', { name: '++' }).click();
    await this.page.getByRole('button', { name: 'Yes', exact: true }).nth(1).click();
    await this.page.getByRole('button', { name: 'Moderate' }).click();
    await this.page.getByRole('button', { name: 'No', exact: true }).nth(0).click();
    await this.page.getByRole('button', { name: 'Yes', exact: true }).nth(2).click();
    await this.page.getByRole('button', { name: 'No', exact: true }).nth(1).click();
    await this.page.getByRole('button', { name: 'Passive' }).click();
    await this.page.getByRole('button', { name: 'Cold' }).click();
    await this.page.getByRole('button', { name: 'Ear Discharge' }).click();
    await this.page.getByRole('button', { name: 'Oral thrush' }).click();
    await this.page.getByRole('button', { name: 'Scabies' }).click();
    await this.page.getByRole('button', { name: 'Inguinal fold' }).click();
    await this.page.getByRole('button', { name: 'Good' }).click();
    await this.page.getByRole('button', { name: 'No', exact: true }).nth(2).click();
    await this.page.getByRole('button', { name: 'Follow-up appointment' }).click();
    await this.save();
  }

  async fillSystemsReviewForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Examen des systèmes');
    await this.page.getByRole('button', { name: 'Loss of Appetite' }).click();
    await this.page.getByRole('button', { name: 'Night sweats' }).click();
    await this.page.getByRole('button', { name: 'Fatigue' }).click();
    await this.page.getByRole('button', { name: 'Rashes' }).click();
    await this.page.getByRole('button', { name: 'Dermatological pruritus' }).click();
    await this.page.getByRole('button', { name: 'Discolorations' }).click();
    await this.page.getByRole('button', { name: 'Headache' }).click();
    await this.page.getByRole('button', { name: 'Dizziness' }).first().click();
    await this.page.getByRole('button', { name: 'Mass' }).click();
    await this.page.getByRole('button', { name: 'Visual disturbance' }).click();
    await this.page.getByRole('button', { name: 'Eye itching' }).click();
    await this.page.getByRole('button', { name: 'Discharge from the eyes' }).click();
    await this.page.getByRole('button', { name: 'Conjuctivitis' }).click();
    await this.page.getByRole('button', { name: 'Teary eyes' }).click();
    await this.page.getByRole('button', { name: 'Ear Discharge' }).click();
    await this.page.getByRole('button', { name: 'Deaf' }).click();
    await this.page.getByRole('button', { name: 'Bleeding' }).click();
    await this.page.getByRole('button', { name: 'Nose Discharge' }).click();
    await this.page.getByRole('button', { name: 'Sinus Congestion' }).click();
    await this.page.getByRole('button', { name: 'Missing' }).click();
    await this.page.getByRole('button', { name: 'Tongue' }).click();
    await this.page.getByRole('button', { name: 'Pallet' }).click();
    await this.page.getByRole('button', { name: 'Dysphagia' }).first().click();
    await this.page.getByRole('button', { name: 'Cough', exact: true }).click();
    await this.page.getByRole('button', { name: 'Orthopnea' }).click();
    await this.page.getByRole('button', { name: 'Platypnea' }).click();
    await this.page.getByRole('button', { name: 'Hemoptysis' }).click();
    await this.page.getByRole('button', { name: 'Chest Pain' }).click();
    await this.page.getByRole('button', { name: 'Lower Extremity Edema' }).click();
    await this.page.getByRole('button', { name: 'Paroxysmal Nocturnal Dyspnea' }).click();
    await this.page.getByRole('button', { name: 'Dyspnea with Exertion' }).click();
    await this.page.getByRole('button', { name: 'Palpitations' }).click();
    await this.page.getByRole('button', { name: 'Dyschezia' }).click();
    await this.page.getByRole('button', { name: 'Abdominal pain' }).click();
    await this.page.getByRole('button', { name: 'Hematemesis' }).click();
    await this.page.getByRole('button', { name: 'Constipation' }).click();
    await this.page.getByRole('button', { name: 'Hematochezia' }).click();
    await this.page.getByRole('button', { name: 'Dysuria' }).click();
    await this.page.getByRole('button', { name: 'Polyuria' }).first().click();
    await this.page.getByRole('button', { name: 'Hesitation' }).click();
    await this.page.getByRole('button', { name: 'Heat Intolerance' }).click();
    await this.page.getByRole('button', { name: 'Hair Problem' }).click();
    await this.page.getByRole('button', { name: 'Dry Skin' }).click();
    await this.page.getByRole('button', { name: 'Joint Deformity' }).click();
    await this.page.locator('div.obs-control-field textarea').fill('Left arm');
    await this.page.getByRole('button', { name: 'Lymphadenopathy' }).click();
    await this.page.locator('div.obs-control-field textarea').nth(1).fill('Under the jaw and chin');
    await this.page.getByRole('button', { name: 'Memory loss' }).click();
    await this.page.getByRole('button', { name: 'Anxiety' }).click();
    await this.page.getByRole('button', { name: 'Language Disorder' }).click();
    await this.page.getByRole('button', { name: 'Self Care Skill Deficiency' }).click();
    await this.page.getByRole('button', { name: 'Motor Skills Disorder' }).click();
    await this.save();
  }

  async fillHealthHistoryForm() {
    await expect(this.page.locator('span.section-label')).toHaveText('Historique de santé');
    await this.page.locator('div textarea').nth(0).fill('Insect bites and stings');
    await this.page.locator('input[type=date]:nth-child(1)').type('08-19-2024');
    await this.page.locator('input[type=number]').nth(0).fill('6');
    await this.page.getByRole('button', { name: 'Month(s)' }).click();
    await this.page.locator('div textarea').nth(1).fill('Allergic to insect bites and strings');
    await this.page.getByRole('button', { name: 'Hopital Sacré Coeur Milot' }).click();
    await this.page.getByRole('group', { name: 'Self Medication Set' }).getByRole('button').first().click();
    await this.page.getByRole('group', { name: 'Self Medication Set' }).getByRole('textbox').fill('Oral antihistamines');
    await this.page.getByRole('group', { name: 'Current Medication Set' }).getByRole('button').nth(1).click();
    await this.page.getByRole('button', { name: 'Asthma' }).first().click();
    await this.page.getByRole('button', { name: 'Hypertension' }).first().click();
    await this.page.getByRole('button', { name: 'Cancer' }).first().click();
    await this.page.getByRole('button', { name: 'Hepatitis' }).click();
    await this.page.getByRole('button', { name: 'Type 1 diabetes' }).first().click();
    await this.page.getByRole('button', { name: 'Tuberculosis' }).click();
    await this.page.getByRole('button', { name: 'Type 2 diabetes' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Sickle-cell anemia' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Mental illness' }).nth(1).click();
    await this.page.locator('div textarea').nth(3).fill('No Trauma history');
    await this.page.locator('div textarea').nth(4).fill('Colorectal surgery');
    await this.page.getByRole('group', { name: 'Alcohol Use Set' }).getByRole('button').nth(1).click();
    await this.page.getByRole('group', { name: 'Tobacco History Set' }).getByRole('button').nth(1).click();
    await this.page.locator('div:nth-child(10) div fieldset div:nth-child(3) .form-builder-column-wrapper .form-field-wrap .form-field-content-wrap button').nth(1).click();
    await this.page.getByRole('button', { name: 'Yes', exact: true }).nth(4).click();
    await this.page.getByRole('button', { name: 'Heterosexual' }).click();
    await this.page.locator('input[type=number]').nth(1).fill('26');
    await this.save();
  }

  async save() {
    await this.page.getByRole('button', { name: /save/i }).click();
    await delay(5000);
  }
}
