const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Organization name',
    description: 'Organization name',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/organization#hasName',
    implementation: {
      label: 'Organization name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Organization Address',
    description: 'Organization address',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/icontact#hasAddress',
    implementation: {
      label: 'Organization Address',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.AddressField,
    }
  },
]