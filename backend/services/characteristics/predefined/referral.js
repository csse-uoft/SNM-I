const {FieldTypes} = require("../misc");
module.exports = [
  {
    name: 'Referral Type',
    description: 'The type of a referral',
    predefinedProperty: 'http://snmi#hasType',
    implementation: {
      label: 'Referral Type',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Referral Status',
    description: 'The status of a referral',
    predefinedProperty: 'http://snmi#hasStatus',
    implementation: {
      label: 'Referral Status',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  }
]