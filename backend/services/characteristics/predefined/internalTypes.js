const {FieldTypes} = require("../misc");
module.exports = [
  {
    name: 'serviceForServiceOccurrence',
    predefinedProperty: 'http://snmi#occurrenceOf',
    formType: 'serviceOccurrence',
    implementation: {
      label: 'Service',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Service'
    }
  },
  {
    name: 'needSatisfierForService',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'service',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },

]