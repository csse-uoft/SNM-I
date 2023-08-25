const {createGraphDBModel, Types} = require("graphdb-utils");
const {GDBTimeIntervalModel} = require("./timeInterval");


const GDBDayScheduleModel = createGraphDBModel({
  dayOfWeek: {type: Types.NamedIndividual, internalKey: 'hasDayOfWeek'},
  timeIntervals: {type: GDBTimeIntervalModel, internalKey: 'hasTimeInterval'}
}, {
  rdfTypes: [':DaySchedule'], name: 'daySchedule'
});

module.exports = {
  GDBDayScheduleModel
}