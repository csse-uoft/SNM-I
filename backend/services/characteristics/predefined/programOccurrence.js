const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Start Date',
    description: 'Start date of a program Occurrence',
    predefinedProperty: 'http://snmi#hasStartDate',
    implementation: {
      label: 'Start Date',
      valueDataType: 'xsd:dateTimes',
      fieldType: FieldTypes.DateTimeField,
    },
  },
  {
    name: 'End Date',
    description: 'End date of a program Occurrence',
    predefinedProperty: 'http://snmi#hasEndDate',
    implementation: {
      label: 'End Date',
      valueDataType: 'xsd:dateTimes',
      fieldType: FieldTypes.DateTimeField,
    },
  },
  {
    name: 'Hours of Operation',
    description: 'Hours of Operation for the program occurrence',
    predefinedProperty: 'http://snmi#hasOperatingHours',
    implementation: {
      label: 'Hours of Operation',
      valueDataType: 'xsd:number',
      fieldType: FieldTypes.NumberField,
    }
  },


  // todo: mode and codes
]
