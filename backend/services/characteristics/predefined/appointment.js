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

]