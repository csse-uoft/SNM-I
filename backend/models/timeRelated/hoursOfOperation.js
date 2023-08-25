const {createGraphDBModel} = require("graphdb-utils");
const {GDBDateScheduleModel} = require("./dateSchedule");
const {GDBWeekScheduleModel} = require("./weekSchedule");


const GDBHoursOfOperationModel = createGraphDBModel({
  dateSchedules: {type: [GDBDateScheduleModel], internalKey: ':hasDateSchedule'},
  weekSchedules: {type: [GDBWeekScheduleModel], internalKey: ':hasWeekSchedule'}
}, {
  rdfTypes: [':HoursOfOperation'], name: 'hoursOfOperation'
});

module.exports = {
  GDBHoursOfOperationModel
}