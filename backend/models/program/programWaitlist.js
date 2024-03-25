const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");

//These might need tweaking, need to figure out what things we need for this model
const {GDBProgramOccurrenceModel} = require("./programOccurrence");
const {GDBProgramWaitlistEntryModel} = require("./programWaitlistEntry");

const GDBProgramWaitlistModel = createGraphDBModel({
  waitlist: {type: [GDBProgramWaitlistEntryModel], internalKey: ':hasWaitlist'},
  programOccurrence: {type: GDBProgramOccurrenceModel, internalKey: ':hasProgramOccurrence'},
},
{  
  rdfTypes: [':ProgramWaitlist'], name: 'programWaitlist'
}

);
module.exports = {
  GDBProgramWaitlistModel
}