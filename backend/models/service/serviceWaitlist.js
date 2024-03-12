const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");

//These might need tweaking, need to figure out what things we need for this model
const {GDBServiceOccurrenceModel} = require("./serviceOccurrence");
const {GDBWaitlistEntryModel} = require("./waitlistEntry");

const GDBServiceWaitlistModel = createGraphDBModel({



    waitlist: {type: [GDBWaitlistEntryModel], internalKey: ':hasWaitlist'},
    serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},

},
{  
    rdfTypes: [':ServiceWaitlist'], name: 'serviceWaitlist'
}

);
module.exports = {
    GDBServiceWaitlistModel
  }