const {createGraphDBModel} = require("../utils/graphdb");
const {GDBUserAccountModel} = require("./userAccount");
const {GDBNeedModel} = require("./need");
const {GDBServiceModel} = require("./service");

const GDBNeedOccurrenceModel = createGraphDBModel({
  occurrenceOf: {type: GDBNeedModel, internalKey: ':occurrenceOf'},
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  modifiedAt: {type: Date, internalKey: ':modifiedAt'},
  modifiedBy:{type: Date, internalKey: 'modifiedBy'},
  acuity:{type: String, internalKey: ':hasAcuity'},
  metByService:{type: GDBServiceModel, internalKey: 'metByService'},
}, {
  rdfTypes: [':NeedOccurrence'], name: 'needOccurrence'
});

module.exports = {
  GDBNeedOccurrenceModel
}