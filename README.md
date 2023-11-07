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
