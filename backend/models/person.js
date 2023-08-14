const {createGraphDBModel, Types, DeleteType} = require("../utils/graphdb");
const {GDBAddressModel} = require('./address')
const {GDBPhoneNumberModel} = require('./phoneNumber')
const {GDBCOModel} = require("./ClientFunctionalities/characteristicOccurrence");

const GDBPersonModel = createGraphDBModel({
  firstName: {type: String, internalKey: 'foaf:givenName'},
  lastName: {type: String, internalKey: 'foaf:familyName'},
  middleName: {type: String, internalKey: 'foaf:middleName'},
  formalName: {type: String, internalKey: 'foaf:formalName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  gender: {type: Types.NamedIndividual, internalKey: 'cwrc:hasGender'},
  email: {type: String, internalKey: 'ic:hasEmail'},
  altEmail: {type: String, internalKey: 'ic:hasAltEmail'},
  telephone: {type: GDBPhoneNumberModel, internalKey: 'ic:hasTelephone', onDelete: DeleteType.CASCADE},
  createDate: {type: Date, internalKey: ':createDate'},
  characteristicOccurrence : {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'},
}, {
  rdfTypes: ['cids:Person'], name: 'person'
});

module.exports = {
  GDBPersonModel
}