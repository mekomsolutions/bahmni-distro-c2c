var showOrHideAdditionalInfoSection = function (patient) {
    var returnValues = {
        show: [],
        hide: []
    };
    
    return returnValues
};
 
Bahmni.Registration.AttributesConditions.rules = {
    'age': function (patient) {
        return showOrHideAdditionalInfoSection(patient);
    }
};