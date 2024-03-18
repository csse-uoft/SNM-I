const {createGraphDBModel, DeleteType, Types} = require("graphdb-utils");
const { GDBServiceRegistrationModel } = require("../serviceRegistration");

const GDBServiceWaitlistEntryModel = createGraphDBModel({
    serviceRegistration: {type: GDBServiceRegistrationModel, internalKey: ':hasServiceRegistration'},
    priority: {type: Number, internalKey: ':hasPriority'},
    date: {type: Date, internalKey: ':hasDate'},
},
{  
    rdfTypes: [':ServiceWaitlistEntry'], name: 'serviceWaitlistEntry'
}
);

module.exports = {
    GDBServiceWaitlistEntryModel
}