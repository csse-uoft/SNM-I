const {createGraphDBModel} = require("graphdb-utils");
const {GDBTimeIntervalModel} = require("./timeInterval");


const GDBDateScheduleModel = createGraphDBModel({
  hasDate: {type: Date, internalKey: 'hasDate'},
  timeInterval: {type: [GDBTimeIntervalModel], internalKey: ':hasTimeInterval'}
}, {
  rdfTypes: [':DateSchedule'], name: 'dateSchedule'
});

module.exports = {
  GDBDateScheduleModel
}