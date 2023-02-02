const {linkedProperty} = require("./helperFunctions");
const {GDBNeedModel} = require("../../models/need/need");
const {GDBNeedOccurrenceModel} = require("../../models/need/needOccurrence");
const {GDBInternalTypeModel} = require("../../models/internalType");
const {SPARQL} = require("../../utils/graphdb/helpers");

const FORMTYPE = 'client'

const clientInternalTypeCreateTreater = async (internalType, instanceData, value) => {
  const property = linkedProperty(FORMTYPE, internalType);
  if (property === 'need'){
    instanceData.needOccurrences = value.map(needURI => {
      const need = GDBNeedModel.findOne({_id: needURI.split('_')[1]});
      const needOccurrence = GDBNeedOccurrenceModel({
        occurrenceOf: needURI,
        })
      return needOccurrence
    })
    instanceData[property + 's'] = value;
  }
};

const clientInternalTypeFetchTreater = async (data) => {
  const result = {};
  const schema =  data.schema;
  for (const property in data) {
    if(property === 'needs') {
      const propertyRemovedS = property.slice(0, -1);
      const internalType = await GDBInternalTypeModel.findOne({predefinedProperty: schema[propertyRemovedS].internalKey, formType: FORMTYPE});
      result[ 'internalType_'+ internalType._id] = data[property].map(SPARQL.getFullURI);
    }
  }
  return result;
};

const clientInternalTypeUpdateTreater = async (internalType, value, result) => {
  // to be done
}

module.exports = {clientInternalTypeCreateTreater, clientInternalTypeFetchTreater}