const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Organization Name',
    description: 'Organization name',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/organization#hasName',
    implementation: {
      label: 'Organization Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
]