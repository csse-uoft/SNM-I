const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Start Date',
    description: 'Start date of a service Occurrence',
    predefinedProperty: 'http://snmi#hasStartDate',
    implementation: {
      label: 'Start Date',
      valueDataType: 'xsd:dateTimes',
      fieldType: FieldTypes.DateTimeField,
    },
  },
  {
    name: 'End Date',
    description: 'End date of a service Occurrence',
    predefinedProperty: 'http://snmi#hasEndDate',
    implementation: {
      label: 'End Date',
      valueDataType: 'xsd:dateTimes',
      fieldType: FieldTypes.DateTimeField,
    },
  },
  {
    name: 'Hours of Operation',
    description: 'Hours of Operation for the service occurrence',
    predefinedProperty: 'http://snmi#hasOperatingHours',
    implementation: {
      label: 'Hours of Operation',
      valueDataType: 'xsd:number',
      fieldType: FieldTypes.NumberField,
    }
  },

  {
    name: 'Description',
    description: 'Description of a service occurrence',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/cids/cids#description',
    implementation: {
      label: 'Description',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  },

  // todo: mode and codes
]