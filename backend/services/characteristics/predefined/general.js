const {FieldTypes} = require("../misc");

module.exports = [{
  name: 'Date and Time',
  description: 'The date and time',
  predefinedProperty: 'http://snmi#hasDatetime',
  implementation: {
    label: 'Date and Time',
    valueDataType: 'xsd:datetimes',
    fieldType: FieldTypes.DateTimeField,
  }
},
  {
    name: 'Address',
    description: 'Address',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/icontact#hasAddress',
    implementation: {
      label: 'Address',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.AddressField,
    }
  },

  {
    name: 'Description',
    description: 'Description',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/cids/cids#hasDescription',
    implementation: {
      label: 'Description',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  },

]
