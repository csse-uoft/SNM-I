const {GDBClientModel, GDBOrganizationModel, GDBPhoneNumberModel} = require("../../models");
const {SPARQL} = require('../../utils/graphdb/helpers');
const {FieldTypes} = require("../characteristics");

const option2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
}

const combinePhoneNumber = ({countryCode, phoneNumber, areaCode}) => {
  let ret = ''
  if(areaCode){
    ret ='+' + countryCode + ' (' + phoneNumber.toString().slice(0,3) + ') ' +
      phoneNumber.toString().slice(3,6) + '-' + phoneNumber.toString().slice(6)
  }else{
    ret = '+' + countryCode + ' ' + phoneNumber.toString().slice(0, 2) + '-' + phoneNumber.toString().slice(2)
  }
  return ret
}

async function fetchSingleGeneric(req, res, next) {
  const {option, id} = req.params;

  if (!option2Model[option])
    return res.status(400).json({success: false, message: 'Invalid generic type.'});

  const data = await option2Model[option].findOne({_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrences']});
  // TODO: model.populate("characteristicOccurrences.occurrenceOf.implementation")

  const result = {};

  // Copy the values to occurrence.value regardless of its type.
  if (data.characteristicOccurrences)
    for (const co of data.characteristicOccurrences) {

      // Assign full URI
      if (co.objectValue) {
        // when object is a phoneNumber
        await co.populate('occurrenceOf.implementation')
        if(co.occurrenceOf.implementation.fieldType === FieldTypes.PhoneNumberField.individualName){
          const id = co.objectValue.split('_')[1]
          co.objectValue = combinePhoneNumber(await GDBPhoneNumberModel.findOne({_id: id}))
        }else if(co.occurrenceOf.implementation.fieldType === FieldTypes.AddressField.individualName){

        }else{
          co.objectValue = SPARQL.getFullURI(co.objectValue);
        }

      } else if (co.multipleObjectValues) {
        co.multipleObjectValues = co.multipleObjectValues.map(value => SPARQL.getFullURI(value));
      }

      result[co.occurrenceOf.individualName.replace(':', '')] =
        co.dataStringValue ?? co.dataNumberValue ?? co.dataBooleanValue ?? co.dataDateValue
        ?? co.objectValue ?? co.multipleObjectValues;
    }

  if (data.questionOccurrences)
    for (const qo of data.questionOccurrences) {
      result[qo.occurrenceOf.replace(':', '')] = qo.stringValue;
    }

  return res.status(200).json({data: result, success: true});
}

module.exports = {
  fetchSingleGeneric,
}