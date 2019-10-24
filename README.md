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
