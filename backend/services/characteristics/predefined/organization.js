const {FieldTypes} = require('../misc');

module.exports = [
  {
    name: 'Organization Name',
    description: 'Organization name',
    predefinedProperty: 'http://ontology.eil.utoronto.ca/tove/organization#hasName',
    implementation: {
      label: 'Organization Name',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Is Partner Organization',
    description: 'Whether the organization is a partner of this organization',
    predefinedProperty: 'http://snmi#isPartner',
    implementation: {
      label: 'Partner Organization?',
      valueDataType: 'xsd:boolean',
      fieldType: FieldTypes.BooleanRadioField,
    },
  },
  {
    name: 'Endpoint URL',
    description: 'URL of the endpoint at which the partner organization can be reached',
    predefinedProperty: 'http://snmi#hasEndpointUrl',
    implementation: {
      label: 'Endpoint URL',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
  {
    name: 'Endpoint Port Number',
    description: 'Port number of the endpoint at which the partner organization can be reached',
    predefinedProperty: 'http://snmi#hasEndpointNumber',
    implementation: {
      label: 'Endpoint Port Number',
      valueDataType: 'xsd:number',
      fieldType: FieldTypes.NumberField,
    },
  },
  {
    name: 'API Key',
    description: 'API key for accessing the partner organization\'s deployment',
    predefinedProperty: 'http://snmi#hasApiKey',
    implementation: {
      label: 'API Key',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.TextField,
    },
  },
]
