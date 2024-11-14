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

### Version 1.7.0
* Added a new location H9

### Version 1.6.3
* Made MSPP - Digestive" concept set to include "Gastritis crisis(K29.7)" and exclude "Gastritis"
* Created panels for CRP and ASO lab tests

### Version 1.6.2
* Updated some lab tests

### Version 1.6.1
* Updated vaccinations concept set

### Version 1.6.0
* Archived list of drugs in Odoo and Bahmni
* Added a question in the Vaccination form 'Is the child fully vaccinated?'
* Fixed Sync issue of Amoxicillin syrup, and metronidazole & Nystatin ovule
* Fixed the MSPP Report Emergency Section figures to reflect the actual urgency
* Enabled MSPP Vaccinations report to capture data on 'Fully vaccinated patients'
* Scheduled task was set to run every hour by default to 'Close stale visits'
* Documented the process to extract and upload data with centralized Ozone Analytics
* Distro was updated to use latest Ozone Analytics
* Fixed 404 error on C2C Analytics servers
* Modified Lab Tests in OpenELIS

### Version 1.5.1
* Fixed Metronidazole drug variant concept uuids.
* Removed 'Sayana Press' from drugs containing the term.
* Added answers to Human Chorionic Gonadotrophin concept

### Version 1.5.0
* Add vaccination and family planning community patient lists
* Fix H-pylori and HCG lab results
* Fix drug name presentation for multi-ingredient medications
* Add Missing Drugs and Medical Supplies

### Version 1.4.0
* Activated billing status widget
* Added bulk cancel orders Odoo add-on
* Patient header to display weight
* Ability to close visits after 12h of inactivity
* Fixed EIP data corrupted after power cut
* Added more tests and services
* Added new concept - 'IUD' to family planning - FP administer
* Adjustment of visit types to add field/at clinic options

### Version 1.3.0
* Removed pricing information from Odoo Config

### Version 1.2.0
* Made HSC form compatible with C2C
