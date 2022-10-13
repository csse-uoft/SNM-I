const {createGraphDBModel} = require("../../utils/graphdb");
const {GDBDateScheduleModel} = require("./dateSchedule");
const {GDBWeekScheduleModel} = require("./weekSchedule");


const GDBHoursOfOperationModel = createGraphDBModel({
  dateSchedule: {type: [GDBDateScheduleModel], internalKey: ':hasDateSchedule'},
  weekSchedule: {type: [GDBWeekScheduleModel], internalKey: ':hasWeekSchedule'}
}, {
  rdfTypes: [':HoursOfOperation'], name: 'hoursOfOperation'
});

module.exports = {
  GDBHoursOfOperationModel
}