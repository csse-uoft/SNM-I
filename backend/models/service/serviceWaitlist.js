const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");




//These might need tweaking, need to figure out what things we need for this model
const {GDBServiceModel} = require("./service");
const {GDBClientModel} = require("../ClientFunctionalities/client");
const { GDBCOModel } = require("../ClientFunctionalities/characteristicOccurrence");


const GDBServiceWaitlistModel = createGraphDBModel({

    clients: {type: [GDBClientModel], internalKey: ':hasClient'},
    service: {type: GDBServiceModel, internalKey: ':hasService'},
    characteristicOccurences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurence'}

},
{  
    rdfTypes: [':ServiceWaitlist'], name: 'serviceWaitlist'
}

);
module.exports = {
    GDBServiceWaitlistModel
  }