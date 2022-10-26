const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'First Name',
    description: 'First name of a person',
    predefinedProperty: 'http://xmlns.com/foaf/0.1/givenName',
    implementation: {
      label: 'First Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Last Name',
    description: 'Last name of a person',
    predefinedProperty: 'http://xmlns.com/foaf/0.1/familyName',
    implementation: {
      label: 'Last Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    }
  },
  {
    name: 'Gender',
    description: 'Gender of a person',
    predefinedProperty: 'http://helpseeker.co/compass#hasGender',
    implementation: {
      label: 'Gender',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://helpseeker.co/compass#CL-Gender'
    }
  },

]