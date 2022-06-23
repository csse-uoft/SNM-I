const {GraphDB, Types, createGraphDBModel, DeleteType} = require('../utils/graphdb');

const {GDBOrganizationModel} = require('./organization');
const {GDBPersonModel} = require('./person');

const GDBSecurityQuestion = createGraphDBModel({
  question: {type: String, internalKey: ':hasSecurityQuestion'},
  // The answer should be case-insensitive.
  answer: {type: String, internalKey: ':hasSecurityQuestionAnswer'},
}, {rdfTypes: [':SecurityQuestion'], name: 'securityQuestion'});


const GDBUserAccountModel = createGraphDBModel({
  // Primary email if for logging in, resetting password and used for communication. (everything)
  primaryEmail: {type: String, internalKey: ':hasPrimaryEmail'},
  // Secondary email is for recovery
  secondaryEmail: {type: String, internalKey: ':hasSecondaryEmail'},
  hash: {type: String, internalKey: ':hasHash'},
  salt: {type: String, internalKey: ':hasSalt'},
  displayName: {type: String, internalKey: ':hasDisplayName'},
  organization: {type: GDBOrganizationModel, internalKey: 'cp:hasOrganization'},

  // Person information
  primaryContact: {type: GDBPersonModel, internalKey: ':hasPrimaryContact'},

  role: {type: String, internalKey: ':hasAccountRole'},
  positionInOrganization: {type: String, internalKey: ':hasPositionInOrganization'},

  expirationDate: {type: Date, internalKey: ':hasExpirationDate'},
  status: {type: String, internalKey: ':hasAccountStatus'},

  // Exact 3 questions, the answer should be case-insensitive.
  securityQuestions: {type: [GDBSecurityQuestion], internalKey: ':hasSecurityQuestion', externalKey: 'securityQuestions'}

}, {
  rdfTypes: [':UserAccount'], name: 'userAccount'
});

module.exports = {GDBUserAccountModel, GDBSecurityQuestion};
