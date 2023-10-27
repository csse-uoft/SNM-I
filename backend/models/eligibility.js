const {createGraphDBModel, DeleteType} = require("graphdb-utils");

const GDBEligibilityModel = createGraphDBModel({
  formula: {type: String, internalKey: ':hasFormula'},
  formulaJSON: {type: String, internalKey: ':hasFormulaJSON'},
  description: {type: String, internalKey: 'cids:hasDescription'}
}, {
  rdfTypes: [':Eligibility'], name: 'eligibility'
});

module.exports = {
  GDBEligibilityModel
}
