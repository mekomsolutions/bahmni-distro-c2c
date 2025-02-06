![alt tag](readme/c2c-logo.png)

# Care 2 Communities Bahmni distribution

>Our model for community-based healthcare delivers results for low-income people and their families. We provide high-quality, affordable, patient-centered care through a clinic model that begins to financially sustain itself over time, ensuring that people get the health care they need today and in perpetuity
><br>
><br>https://care2communities.org/

-----

This repository maintains the 'distro POM' for the _C2C Bahmni distribution_.

It downloads and brings in one place all artifacts needed by the distribution, simply run:
```
mvn clean package
```
### Target inventory:

* `bahmni_emr/`
<br/>The target version of the front-end apps that makes 'Bahmni EMR'.
* `bahmni_config/`
<br/>The bespoke Bahmni configuration (more [here](https://github.com/mekomsolutions/bahmni-config-c2c)) to be consumed by Bahmni Apps.
* `openmrs_modules/`
<br/>The required set of OpenMRS modules.
* `openmrs_config/`
<br/>The OpenMRS bespoke configuration (more [here](https://github.com/mekomsolutions/openmrs-config-c2c)) to be processed by the [Initializer module](https://github.com/mekomsolutions/openmrs-module-initializer).
* `openmrs_core/`
The target version of OpenMRS Core.

## Release Notes

<details>
  <summary><b>Version 2.0.0</b></summary>

   <ul>
    <li>Added a new location H9.</li>
    <li>Merged OpenMRS, Bahmni and Odoo configs into the distro</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.6.3</b></summary>
   <ul>
    <li>Made "MSPP - Digestive" concept set to include "Gastritis crisis(K29.7)" and exclude "Gastritis".</li>
    <li>Created panels for CRP and ASO lab tests.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.6.2</b></summary>
   <ul>
    <li>Updated some lab tests.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.6.1</b></summary>
   <ul>
    <li>Updated vaccinations concept set.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.6.0</b></summary>
   <ul>
    <li>Archived list of drugs in Odoo and Bahmni.</li>
    <li>Added a question in the Vaccination form 'Is the child fully vaccinated?'.</li>
    <li>Fixed Sync issue of Amoxicillin syrup, and metronidazole & Nystatin ovule.</li>
    <li>Fixed the MSPP Report Emergency Section figures to reflect the actual urgency.</li>
    <li>Enabled MSPP Vaccinations report to capture data on 'Fully vaccinated patients'.</li>
    <li>Scheduled task was set to run every hour by default to 'Close stale visits'.</li>
    <li>Documented the process to extract and upload data with centralized Ozone Analytics.</li>
    <li>Updated Distro to use latest Ozone Analytics.</li>
    <li>Fixed 404 error on C2C Analytics servers.</li>
    <li>Modified Lab Tests in OpenELIS.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.5.1</b></summary>
   <ul>
    <li>Fixed Metronidazole drug variant concept uuids.</li>
    <li>Removed 'Sayana Press' from drugs containing the term.</li>
    <li>Added answers to Human Chorionic Gonadotrophin concept.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.5.0</b></summary>
   <ul>
    <li>Added vaccination and family planning community patient lists.</li>
    <li>Fixed H-pylori and HCG lab results.</li>
    <li>Fixed drug name presentation for multi-ingredient medications.</li>
    <li>Added Missing Drugs and Medical Supplies.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.4.0</b></summary>
   <ul>
    <li>Activated billing status widget.</li>
    <li>Added bulk cancel orders Odoo add-on.</li>
    <li>Patient header to display weight.</li>
    <li>Added ability to close visits after 12h of inactivity.</li>
    <li>Fixed EIP data corrupted after power cut.</li>
    <li>Added more tests and services.</li>
    <li>Added new concept - 'IUD' to family planning - FP administer.</li>
    <li>Adjusted visit types to add field/at clinic options.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.3.0</b></summary>
   <ul>
    <li>Removed pricing information from Odoo Config.</li>
  </ul>
</details>

<details>
  <summary><b>Version 1.2.0</b></summary>
   <ul>
    <li>Made HSC form compatible with C2C.</li>
  </ul>
</details>
