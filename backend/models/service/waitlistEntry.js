const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");

//These might need tweaking, need to figure out what things we need for this model
const {GDBClientModel} = require("../ClientFunctionalities/client");


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