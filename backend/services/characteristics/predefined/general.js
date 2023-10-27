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
  {
    name: 'Date',
    description: 'The date',
    predefinedProperty: 'http://snmi#hasDate',
    implementation: {
      label: 'Date',
      valueDataType: 'xsd:datetimes',
      fieldType: FieldTypes.DateField,
    }
  },
  {
    name: 'Note',
    description: 'The note',
    predefinedProperty: 'http://snmi#hasNote',
    implementation: {
      label: 'Note',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  },
  {
    name: 'Eligibility',
    description: 'The eligibility of a program or a service.',
    predefinedProperty: 'http://snmi#hasEligibility',
    implementation: {
      label: 'Eligibility',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.EligibilityField,
    }
  },
]
