const {createGraphDBModel, DeleteType} = require("../../utils/graphdb");
const {GDBQOModel} = require("./questionOccurrence");


const GDBClientModel = createGraphDBModel({
  characteristicOcc: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOcc: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':Client'], name: 'client'
});

module.exports = {
  GDBClientModel
}