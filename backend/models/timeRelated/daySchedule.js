const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBTimeIntervalModel} = require("./timeInterval");


const GDBDayScheduleModel = createGraphDBModel({
  // instance of time:DayOfWeek
  dayOfWeek: {type: Types.NamedIndividual, internalKey: ':hasDayOfWeek'},
  // time intervals in a single day, includes timezone
  timeIntervals: {type: [GDBTimeIntervalModel], internalKey: ':hasTimeInterval', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':DaySchedule'], name: 'daySchedule'
});

module.exports = {
  GDBDayScheduleModel
}