const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const {GDBProgramRegistrationModel} = require("../programRegistration");

const GDBProgramWaitlistEntryModel = createGraphDBModel({
  programRegistration: {type: GDBProgramRegistrationModel, internalKey: ':hasProgramRegistration'},
  priority: {type: Number, internalKey: ':hasPriority'},
  date: {type: Date, internalKey: ':hasDate'},
},
{  
  rdfTypes: [':ProgramWaitlistEntry'], name: 'programWaitlistEntry'
}

);
module.exports = {
  GDBProgramWaitlistEntryModel
}