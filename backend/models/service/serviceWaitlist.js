const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");

//These might need tweaking, need to figure out what things we need for this model
const {GDBServiceModel} = require("./service");
const {GDBNeedModel} = require("../need/need");


const GDBServiceWaitlistModel = createGraphDBModel({
    occurrenceOf: {type: GDBServiceModel, internalKey: ':occurrenceOf'},
    clients: {type: [GDBNeedModel], internalKey: ':hasNeed'},
},
{  
    rdfTypes: [':ServiceWaitlist'], name: 'serviceWaitlist'
}

);
module.exports = {
    GDBServiceWaitlistModel
  }