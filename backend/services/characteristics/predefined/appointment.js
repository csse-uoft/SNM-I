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
    name: 'Appointment Status',
    description: 'The status of an appointment',
    predefinedProperty: 'http://snmi#hasStatus',
    implementation: {
      label: 'Appointment Status',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  },

]