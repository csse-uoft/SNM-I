const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Notification Name',
    description: 'Notification Name',
    predefinedProperty: 'http://snmi#hasName',
    implementation: {
      label: 'Notification Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Is Notification Read?',
    description: 'Is Notification Read?',
    predefinedProperty: 'http://snmi#isRead',
    implementation: {
      label: 'Is Notification Read?',
      valueDataType: 'xsd:boolean',
      fieldType: FieldTypes.BooleanRadioField,
    },
  },

]