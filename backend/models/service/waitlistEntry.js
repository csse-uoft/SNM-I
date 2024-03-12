const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const { GDBServiceRegistrationModel } = require("../serviceRegistration");

const GDBWaitlistEntryModel = createGraphDBModel({

    client: {type: GDBServiceRegistrationModel, internalKey: ':hasRegs'},
    priority: {type: Number, internalKey: ':hasPriority'},
    date: {type: Date, internalKey: ':hasDate'},
},
{  
    rdfTypes: [':WaitlistEntry'], name: 'waitlistEntry'
}

);
module.exports = {
    GDBWaitlistEntryModel
  }