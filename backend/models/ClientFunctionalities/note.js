const {createGraphDBModel, DeleteType} = require("graphdb-utils");
const {GDBUserAccountModel} = require("../userAccount");

const GDBNoteModel = createGraphDBModel({
  value: {type: String, internalKey: ':hasValue'},
  createdBy: {type: GDBUserAccountModel, internalKey: ':createdBy'},
  createdAt: {type: Date, internalKey: ':createdAt'}
}, {
  rdfTypes: [':Note'], name: 'note'
});

module.exports = {
  GDBNoteModel
}