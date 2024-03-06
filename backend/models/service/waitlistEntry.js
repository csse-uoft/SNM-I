const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");




//These might need tweaking, need to figure out what things we need for this model
const {GDBClientModel} = require("../ClientFunctionalities/client");



const GDBWaitlistEntryModel = createGraphDBModel({

    client: {type: GDBClientModel, internalKey: ':hasClient'},
    priority: {type: Number, internalKey: ':hasPriority'}
},
{  
    rdfTypes: [':ServiceWaitlist'], name: 'serviceWaitlist'
}

);
module.exports = {
    GDBWaitlistEntryModel
  }