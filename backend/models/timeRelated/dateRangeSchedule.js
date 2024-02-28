const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBDayScheduleModel} = require("./daySchedule");


const GDBDateRangeScheduleModel = createGraphDBModel({
  startDate: {type: Date, internalKey: ':hasStartDate'},
  endDate: {type: Date, internalKey: ':hasEndDate'},
  daySchedule: {type: [GDBDayScheduleModel], internalKey: ':hasDaySchedule', onDelete: DeleteType.CASCADE}
}, {
  rdfTypes: [':DateRangeSchedule'], name: 'dateRangeSchedule'
});

module.exports = {
  GDBDateRangeScheduleModel
}