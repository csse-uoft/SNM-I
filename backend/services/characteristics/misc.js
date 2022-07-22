const {GDBFieldTypeModel} = require('../../models/ClientFunctionalities/fieldType');
const {GraphDB} = require('../../utils/graphdb')

const type2Label = {
  TextField: 'Text Field',
  NumberField: 'Number Field',
  BooleanRadioField: 'Yes or No Field',

  DateField: 'Date Field',
  DateTimeField: 'DateTime Field',
  TimeField: 'Time Field',

  MultiSelectField: 'Multiple Select',
  SingleSelectField: 'Single Select',
  RadioSelectField: 'Radio Select',

  PhoneNumberField: 'Phone Number Field',
  AddressField: 'Address Field',
}

const dataTypes = [
  {label: 'String', value: 'xsd:string'},
  {label: 'Number', value: 'xsd:number'},
  {label: 'Boolean', value: 'xsd:boolean'},
  {label: 'Date', value: 'xsd:datetimes'},
  {label: 'Other object', value: 'owl:NamedIndividual'}
];

/**
 *
 * Init FieldTypes.
 * @returns {Promise<void>}
 */
async function initFieldTypes() {
  const newFieldTypes = {...type2Label};
  const fieldTypes = await GDBFieldTypeModel.find({});
  for (const fieldType of fieldTypes) {
    if (Object.keys(type2Label).includes(fieldType.type)) {
      fieldType.label = type2Label[fieldType.type];
      // This won't be triggered if label is unchanged.
      await fieldType.save();
      delete newFieldTypes[fieldType.type];
    }
  }

  // Create new field types
  for (const [type, label] of Object.entries(newFieldTypes)) {
    await new GDBFieldTypeModel({type, label}).save();
  }

}

async function getFieldTypes(req, res) {
  const fieldTypes = await GDBFieldTypeModel.find({});
  const fieldTypesObject = {};
  for (const {type, label} of Object.values(fieldTypes)) {
    fieldTypesObject[type] = label;
  }
  res.json(fieldTypesObject);
}

async function getDataTypes(req, res) {
  const dataTypesObject = {};
  for (const {value, label} of Object.values(dataTypes)) {
    dataTypesObject[value] = label;
  }
  res.json(dataTypesObject);
}

async function getAllClasses(req, res) {
  const classes = {};

  const query = `
    PREFIX : <http://snmi#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX cids: <http://ontology.eil.utoronto.ca/cids/cids#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    select * 
    from <http://ontology.eil.utoronto.ca/cids/cids>
    from <http://snmi>
    from <http://helpseeker.co/compass>
    where { 
        ?s a owl:Class.
        OPTIONAL {?s rdfs:label ?label .}
        FILTER (isIRI(?s))
    }`;

  await GraphDB.sendSelectQuery(query, false, ({s, label}) => {
    classes[s.id] = label?.value || s.id;
  });
  res.json(classes);
}


module.exports = {initFieldTypes, getFieldTypes, getDataTypes, getAllClasses}
