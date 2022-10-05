const {createGraphDBModel, Types} = require("../utils/graphdb");


const GDBTimeIntervalModel = createGraphDBModel({
  startTime: {type: Date, internalKey: 'hasStartTime'},
  endTime: {type: Date, internalKey: 'hasEndTime'}
}, {
  rdfTypes: [':TimeInterval'], name: 'timeInterval'
});

module.exports = {
  GDBTimeIntervalModel
}