const {createGraphDBModel} = require("../utils/graphdb");
const {GDBUserAccountModel} = require("./userAccount");

const GDBNeedModel = createGraphDBModel({

}, {
  rdfTypes: [':Need'], name: 'need'
});

module.exports = {
  GDBNeedModel
}