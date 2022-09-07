const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Service Provider Name',
    description: 'Service Provider name',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/organization#hasName',
    implementation: {
      label: 'Service Provider Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Service Provider Address',
    description: 'Service Provider address',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/icontact#hasAddress',
    implementation: {
      label: 'Service Provider Address',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.AddressField,
    }
  },
]