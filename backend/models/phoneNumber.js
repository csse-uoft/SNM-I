const {createGraphDBModel, Types} = require("../utils/graphdb");
const GDBPhoneNumberModel = createGraphDBModel({
  areaCode: {type: Number, internalKey: 'ic:hasAreaCode'},
  countryCode: {type: Number, internalKey: 'ic:hasCountryCode'},
  phoneNumber: {type: String, internalKey: 'ic:hasPhoneNumber'},
  phoneType: {type: Types.NamedIndividual, internalKey: 'ic:hasPhoneType'},
}, {rdfTypes: ['ic:PhoneNumber'], name: 'phoneNumber'});

module.exports = {GDBPhoneNumberModel}
