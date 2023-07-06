const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Program Name',
    description: 'Program name',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/organization#hasName',
    implementation: {
      label: 'Program Name',
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
]
