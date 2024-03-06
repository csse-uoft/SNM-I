const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");




//These might need tweaking, need to figure out what things we need for this model
const {GDBClientModel} = require("../ClientFunctionalities/client");
const { GDBCOModel } = require("../ClientFunctionalities/characteristicOccurrence");
const { GDBProgramOccurenceModel } = require("./programOccurrence");



const GDBProgramWaitlistModel = createGraphDBModel({

    clients: {type: [GDBClientModel], internalKey: ':hasClient'},
    service: {type: GDBProgramOccurenceModel, internalKey: ':hasProgramOccurence'}
},
{  
    rdfTypes: [':ProgramWaitlist'], name: 'ProgramWaitlist'
}

);
module.exports = {
    GDBProgramWaitlistModel
  }