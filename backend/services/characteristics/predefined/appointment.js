const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Appointment Name',
    description: 'Appointment Name',
    predefinedProperty: 'http://snmi#hasName',
    implementation: {
      label: 'Appointment Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Date and Time',
    description: 'The date and time of an appointment',
    predefinedProperty: 'http://snmi#hasDatetime',
    implementation: {
      label: 'Date and Time',
      valueDataType: 'xsd:datetimes',
      fieldType: FieldTypes.DateTimeField,
    }
  },
  // {
  //   name: 'Client',
  //   description: 'Associate with an SNM-I Client',
  //   predefinedProperty: 'http://snmi#hasClient',
  //   implementation: {
  //     label: 'Client',
  //     valueDataType: 'owl:NamedIndividual',
  //     fieldType: FieldTypes.SingleSelectField,
  //     optionsFromClass: 'http://snmi#Client'
  //   }
  // },
  // {
  //   name: 'Person',
  //   description: 'Associate with a Person in SNM-I',
  //   predefinedProperty: 'http://snmi#hasPerson',
  //   implementation: {
  //     label: 'Person',
  //     valueDataType: 'owl:NamedIndividual',
  //     fieldType: FieldTypes.SingleSelectField,
  //     optionsFromClass: 'http://ontology.eil.utoronto.ca/cids/cids#Person'
  //   }
  // },
]