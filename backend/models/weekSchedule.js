const {createGraphDBModel, Types} = require("../utils/graphdb");
const {GDBDayScheduleModel} = require("./daySchedule");


const GDBWeekScheduleModel = createGraphDBModel({
  startDate: {type: Date, internalKey: 'hasStartDate'},
  endDate: {type: Date, internalKey: 'hasEndDate'},
  daySchedule: {type: GDBDayScheduleModel, internalKey: 'hasDaySchedule'}
}, {
  rdfTypes: [':WeekSchedule'], name: 'WeekSchedule'
});

module.exports = {
  GDBWeekScheduleModel
}