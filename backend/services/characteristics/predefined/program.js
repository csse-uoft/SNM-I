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
    name: 'Shareability',
    description: 'Shareability',
    predefinedProperty: 'http://snmi#hasShareability',
    implementation: {
      label: 'Shareability',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.SingleSelectField,  // requires custom field
    },
  },
//  {
//    name: 'Service Provider',
//    description: 'Service provider of the program',
//    predefinedProperty: 'http://snmi#hasServiceProvider',
//    implementation: {
//      label: 'Service Provider',
//      valueDataType: 'owl:NamedIndividual',
//      fieldType: FieldTypes.SingleSelectField,
//      optionsFromClass: 'http://snmi#ServiceProvider'
//    }
//  },
]
