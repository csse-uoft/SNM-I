const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Service Name',
    description: 'Service name',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/organization#hasName',
    implementation: {
      label: 'Service Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },

  {
    name: 'Eligibility Condition',
    description: 'Eligibility Condition of the service',
    predefinedProperty: 'http://snmi#hasEligibilityCondition',
    implementation: {
      label: 'Eligibility Condition',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  },

  // {
  //   name: 'Need Satisfier',
  //   description: 'Need satisifer of the service',
  //   predefinedProperty: 'http://snmi#hasNeedSatisfier',
  //   implementation: {
  //     label: 'Need Satisfier',
  //     valueDataType: 'owl:NamedIndividual',
  //     fieldType: FieldTypes.SingleSelectField,
  //     optionsFromClass: 'http://snmi#NeedSatisfier'
  //   }
  // },
  // {
  //   name: 'Service Provider',
  //   description: 'Service provider of the service',
  //   predefinedProperty: 'http://snmi#hasServiceProvider',
  //   implementation: {
  //     label: 'Service Provider',
  //     valueDataType: 'owl:NamedIndividual',
  //     fieldType: FieldTypes.SingleSelectField,
  //     optionsFromClass: 'http://snmi#ServiceProvider'
  //   }
  // },
  // todo: mode and codes
]