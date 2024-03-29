const {createGraphDBModel, Types, DeleteType} = require("graphdb-utils");
const {GDBFIIModel} = require("./formItemImplementation");

/**
 * Characteristic Model in GraphDB
 */
const GDBCharacteristicModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  name: {type: String, internalKey: ':hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  // predefined characteristics (i.e. firstName, lastName) link to properties that already defined in compass Ontology.
  predefinedProperty: {type: Types.NamedIndividual, internalKey: ':hasPredefinedProperty'},
  isPredefined: {type: Boolean, internalKey: ':isPredefined'},
  implementation: {type: GDBFIIModel, internalKey: ':hasFormItemImplementation', onDelete: DeleteType.CASCADE},
  kindOf: {type: [() => GDBCharacteristicModel], internalKey: ':kindOf'},
}, {
  rdfTypes: [':characteristics'], name: 'characteristic'
});

module.exports = {
  GDBCharacteristicModel
}