const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBDateRangeScheduleModel} = require("./dateRangeSchedule");


const GDBHoursOfOperationModel = createGraphDBModel({
  schedules: {type: [GDBDateRangeScheduleModel], internalKey: ':hasSchedule', onDelete: DeleteType.CASCADE}
}, {
  rdfTypes: [':HoursOfOperation'], name: 'hoursOfOperation'
});

module.exports = {
  GDBHoursOfOperationModel
}