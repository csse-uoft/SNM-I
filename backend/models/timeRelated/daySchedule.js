const {createGraphDBModel, Types} = require("../../utils/graphdb");
const {GDBTimeIntervalModel} = require("./timeInterval");


const GDBDayScheduleModel = createGraphDBModel({
  dayOfWeek: {type: Types.NamedIndividual, internalKey: 'hasDayOfWeek'},
  timeInterval: {type: GDBTimeIntervalModel, internalKey: 'hasTimeInterval'}
}, {
  rdfTypes: [':DaySchedule'], name: 'daySchedule'
});

module.exports = {
  GDBDayScheduleModel
}