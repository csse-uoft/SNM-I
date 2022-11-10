const {GDBFieldTypeModel} = require('../../models/ClientFunctionalities/fieldType');
const {GDBCharacteristicModel} = require('../../models/ClientFunctionalities/characteristic');
const {GraphDB} = require('../../utils/graphdb');
const {SPARQL, sortObjectByKey} = require('../../utils/graphdb/helpers');
const {GDBInternalTypeModel} = require("../../models/internalType");

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

const fieldTypeCache = {};

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

      // Cache it
      fieldTypeCache[fieldType.type] = fieldType;
    }
  }

  // Create new field types
  for (const [type, label] of Object.entries(newFieldTypes)) {
    const newFieldType = new GDBFieldTypeModel({type, label});
    await newFieldType.save();

    // Cache it
    fieldTypeCache[newFieldType.type] = newFieldType;
  }
}


async function initPredefinedCharacteristics() {
  const {allPredefinedCharacteristics} = require('./predefined');
  const predefined = {...allPredefinedCharacteristics};
  const existingPredefined = await GDBCharacteristicModel.find({isPredefined: true});
  for (const existingCharacteristic of existingPredefined) {
    if (Object.keys(predefined).includes(existingCharacteristic.name)) {
      Object.assign(existingCharacteristic, predefined);

      // This won't be triggered if the predefined characteristic is not changed.
      await existingCharacteristic.save();
      delete predefined[existingCharacteristic.name];
    }
  }

  // Create new field types
  for (const characteristic of Object.values(predefined)) {
    await new GDBCharacteristicModel(characteristic).save();
  }

}

async function initPredefinedInternalType() {
  const {allPredefinedInternalType} = require('./predefined');
  const predefined = {...allPredefinedInternalType}
  const existingPredefined = await GDBInternalTypeModel.find({isPredefined: true});
  for (const existingInternalType of existingPredefined) {
    if (Object.keys(predefined).includes(existingInternalType.name)) {
      Object.assign(existingInternalType, predefined);

      // This won't be triggered if the predefined characteristic is not changed.
      await existingInternalType.save();
      delete predefined[existingInternalType.name];
    }
  }

  // Create new field types
  for (const internalType of Object.values(predefined)) {
    await new GDBInternalTypeModel(internalType).save();
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
    ${SPARQL.getSPARQLPrefixes()}
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
    if (label?.value) {
      classes[s.id] = `${SPARQL.getPrefixedURI(s.id)} (${label.value})`;
    } else {
      classes[s.id] = SPARQL.getPrefixedURI(s.id) || s.id;
    }

  });
  res.json(sortObjectByKey(classes));
}


module.exports = {
  initFieldTypes, getFieldTypes, getDataTypes, getAllClasses,
  initPredefinedCharacteristics, FieldTypes: fieldTypeCache, initPredefinedInternalType
}
