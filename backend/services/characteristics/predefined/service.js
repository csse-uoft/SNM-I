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
]