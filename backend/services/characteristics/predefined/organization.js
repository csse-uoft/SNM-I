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
    name: 'Organization Status',
    description: 'Organization status',
    predefinedProperty: 'http://snmi#hasStatus',
    implementation: {
      label: 'Organization Status',
      valueDataType: 'xsd:string',
      fieldType: FieldTypes.SingleSelectField,
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
