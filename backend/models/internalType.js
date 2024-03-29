const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBFIIModel} = require("./ClientFunctionalities/formItemImplementation");

/**
 * internalType Model in GraphDB
 */
const GDBInternalTypeModel = createGraphDBModel({
  name: {type: String, internalKey: ':hasName'},
  // predefined characteristics (i.e. firstName, lastName) link to properties that already defined in compass Ontology.
  predefinedProperty: {type: Types.NamedIndividual, internalKey: ':hasPredefinedProperty'},
  isPredefined: {type: Boolean, internalKey: ':isPredefined'},
  formType: {type: String, internalKey: ':forFormType'},
  implementation: {type: GDBFIIModel, internalKey: ':hasFormItemImplementation'}
}, {
  rdfTypes: [':internalType'], name: 'internalType'
});

module.exports = {
  GDBInternalTypeModel
}