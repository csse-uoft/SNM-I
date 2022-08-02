const {createGraphDBModel, DeleteType} = require("../../utils/graphdb");
const {GDBQuestionOccurrenceModel} = require("./questionOccurrence");


const GDBClientModel = createGraphDBModel({
  // characteristicOcc: {type: [GDBCharacteristicOccurrenceModel],
  //   internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOcc: {type: [GDBQuestionOccurrenceModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':Client'], name: 'client'
});

module.exports = {
  GDBClientModel
}