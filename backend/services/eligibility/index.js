const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {SPARQL} = require("graphdb-utils");
const {GDBAddressModel} = require("../../models/address");
const {getIndividualsInClass} = require("../dynamicForm");


async function getEligibilityConfig() {
  const rawData = await GDBCharacteristicModel.find({},
    {populates: ['implementation.fieldType', 'implementation.options']});
  const data = {};
  const fieldType2URI = {};
  await Promise.all(rawData.map(async (characteristic) => {
    if (['AddressField', 'EligibilityField', 'PhoneNumberField'].includes(characteristic.implementation.fieldType.type)) {
      fieldType2URI[characteristic.implementation.fieldType.type] = `characteristic_${characteristic._id}`;
      return;
    }
    let options;
    if (characteristic.implementation.options) {
      options = Object.fromEntries(characteristic.implementation.options.map(option => [option._uri, option.label]))
    } else if (characteristic.implementation.optionsFromClass) {
      options = await getIndividualsInClass(characteristic.implementation.optionsFromClass);
    }

    data[`characteristic_${characteristic._id}`] = {
      label: characteristic.implementation.label,
      name: characteristic.name,
      description: characteristic.description,
      fieldType: characteristic.implementation.fieldType.type,
      optionsFromClass: characteristic.implementation.optionsFromClass,
      options,
    }
  }));

  // Flatten Address field
  const addressSubFields = Object.keys(GDBAddressModel.schema);
  for (const subField of addressSubFields) {
    let options, fieldType = 'TextField';

    if (subField === 'streetType') {
      options = await getIndividualsInClass('ic:StreetType');
      fieldType = 'SingleSelectField';
    } else if (subField === 'streetDirection') {
      options = await getIndividualsInClass('ic:StreetDirection');
      fieldType = 'SingleSelectField';
    } else if (subField === 'state') {
      options = await getIndividualsInClass('schema:State');
      fieldType = 'SingleSelectField';
    } else if (subField === 'country') {
      options = await getIndividualsInClass('schema:Country');
      fieldType = 'SingleSelectField';
    }
    data[[fieldType2URI['AddressField'], subField].join('.')] = {
      label: `address.${subField}`,
      name: `address.${subField}`,
      description: `Address ${subField.slice(0, 1).toLocaleUpperCase() + subField.slice(1)}`,
      fieldType,
      options,
    }
  }

  // TODO: Flatten Phone number Field


  return data;
}

const getEligibilityConfigHandler = async (req, res, next) => {
  try {
    return res.status(200).json({data: await getEligibilityConfig(), success: true});
  } catch (e) {
    next(e)
  }
}
module.exports = {
  getEligibilityConfigHandler, getEligibilityConfig
}