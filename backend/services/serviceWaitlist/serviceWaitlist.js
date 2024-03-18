const {GDBServiceRegistrationModel} = require("../../models/serviceRegistration");
const {GDBServiceWaitlistModel} = require("../../models/service/serviceWaitlist");
const {GDBWaitlistEntryModel} = require("../../models/service/waitlistEntry");


//TODO: NOTE THESE FUNCTIONS ARE UNTESTED AS OF MARCH 6 2024


/*
-- OLD/DEPRECATED DOCUMENTATION --

given a waitlist and some registration in "req"
(which I will assume has the id to some serviceWaitlist
and the "client" and "priority" for a waitlistEntry, see /backend/models/service/waitlistEntry.js),
add this new registration on the waitlist accordingly.
That is, we should have three attributes:


1. the id of the waitlist: req.params.id
2. the id of the client to be inserted: req.body.clientId
3. the priority this client will have in the waitlist: req.body.priority


Waitlist insertion is based on specified priority.
Note that for now I am treating priority as a number (see the waitlistEntry model)
where a smaller number has more priority (like ranking/tiers, e.g. tier 1, tier 2, ..., tier n etc. 
where tier 1 is the highest priority). This might make it easier as if we use dates instead, we could
possible just convert the date into a number meaning that the smaller number should theoretically have a 
earlier date (if formatted correctly)

--END OF OUTDATED DOCUMENTATION--
*/



/*
UPDATE:

NEW: changing input to take in a serviceOccurrence ID instead of the ID of the waitlist

given a serviceOccurrence ID and some serviceRegistration ID in "req.params", as well as priority (Number), and date (Date)
in "req.body" (see /backend/models/service/waitlistEntry.js),
add this new registration on the waitlist accordingly.
That is, we should have three attributes:

1. the id of the serviceOccurrence: req.params.id
2. the id of the serviceRegistration to be inserted: req.body.serviceRegistrationId
3. the priority this registration will have in the waitlist: req.body.priority
4. the date the registration was made: req.body.date

Waitlist insertion is based on specified priority.
Note that for now I am treating priority as a number (see the waitlistEntry model)
where a smaller number has more priority (like ranking/tiers, e.g. tier 1, tier 2, ..., tier n etc. 
where tier 1 is the highest priority). Date could theoretically be used to determine the priority
however this can/will be added in a future update.

*/


const pushToWaitlist = async (id, serviceRegistrationId, priority, date) => {
    //probably need some more security checks to make sure that what I'm about to operate on safe data. 
    //Will touch this up later as I just need things to work at the moment.

    try {
        //grab the waitlist, and the corresponding client to be registered
        const waitlist = await GDBServiceWaitlistModel.findOne({'serviceOccurrence': {_id: id}});
        const serviceRegistration = await GDBServiceRegistrationModel.findById(serviceRegistrationId);
        //create a new entry, this will be added to our waitlist
        const newEntry = GDBWaitlistEntryModel({'serviceRegistration': serviceRegistration, 'priority': priority, 'date': date});
        //save this new entry to the db
        await newEntry.save();

        //now begin insertion:

        //try to find the index of the first element in the "waitlist" attribute
        //whose priority is greater than the priority of our new entry into the waitlist, as highest
        //priority = lower number
        let insertionIndex;
        if (!waitlist.waitlist) {
            waitlist.waitlist = [];
            insertionIndex = -1;
        } else {
            insertionIndex = waitlist.waitlist.findIndex(entry => entry.priority > priority);
        }

        //in the event that no index is found, add our value to the end of the waitlist:
        if (insertionIndex === -1) {
            waitlist.waitlist.push(newEntry);
        } else {
            //now we need to find where the last index is with the same priority as the new registration
            //this is because if someone was already there with the same priority as the new registration,
            //they should go first still
            while (insertionIndex < waitlist.waitlist.length && waitlist.waitlist[insertionIndex].priority === newEntry.priority) {
                insertionIndex++; //just incrementing until we find where we need to insert
            } 

            //insert the new registration to where it belongs
            waitlist.waitlist.splice(insertionIndex, 0, newEntry);
        }
        
        //save the changes made to this waitlist after insertion
        await waitlist.save();
    } catch (e) {
        throw e;
    }
    //end of function :)))
}


/*given a serviceOccurrence, remove and return the registration (as a waitlistEntry) of the client that is next in line 
from the serviceOccurrence's correspondingwaitlist. See the notes above on top of pushToWaitlist().

assume that we have:
1. the serviceOccurrence id: req.params.id
 */
const popFromWaitlist = async (id) => {
    //again, might need to do some checks/security measures to make sure we
    //aren't doing anything we aren't supposed to, will do this later
    
    try {
        //get the waitlist we need to modify
        const waitlist = await GDBServiceWaitlistModel.findOne({'serviceOccurrence': {_id: id}},
            {
                populates: ['serviceOccurrence.characteristicOccurrences', 'waitlist', 'waitlist.serviceRegistration',
                    'waitlist.serviceRegistration.characteristicOccurrences']
            });
        //go into our waitlist, pop out the item in the front of our list/queue (since we are sorting)
        //from ascending priority where the lowest priority value = the client that should get off the waitlist first
        const dequeuedEntry = waitlist.waitlist?.shift();
        await waitlist.save();
        if (!dequeuedEntry) {
            return null;
        }
        const serviceRegistration = dequeuedEntry.serviceRegistration;

        //now delete the item
        await GDBWaitlistEntryModel.findByIdAndDelete(dequeuedEntry._id);
        //TODO: ASK IF THIS IS THE RIGHT WAY TO GET THE ID FROM AN OBJECT, NOT SURE IF THIS IS RIGHT OR NOT

        //now return success and the thing that just got deleted:
        return serviceRegistration;
    } catch (e) {
        throw e;
    }
    //end of function :)))
}




/*given a serviceOccurrence ID and the id 
of a serviceRegistration that must be dequeued from it, delete the registration (waitlistEntry) 
from the queue. See the notes above on top of pushToWaitlist().

assume that we will get the following from req:

1. the serviceOccurrence id: req.params.id
2.the id of the serviceRegistration that needs to be removed from the waitlist: req.body.serviceRegistrationId


*/
const removeFromWaitlist = async (id, serviceRegistrationId) => {
    // like the other two function, I may need to do some checks sure we're not doing any
    //operations that are invalid, or on things that do not exist.

    try {

        //get the waitlist we need to modify 
        const waitlist = await GDBServiceWaitlistModel.findOne({'serviceOccurrence': {_id: id}}, {populates: ['waitlist']});

        //now we go through the waitlist and find where the client we need to delete is based
        //on the given id.

        let removedEntry;
        const newWaitlist = waitlist.waitlist?.filter(entry => {
            if (entry.serviceRegistration?.split('_')[1] === serviceRegistrationId){
                removedEntry = entry; //save this so we can delete the registration from the db as well
                return false; //returning false means that the item we are deleting is no long in the waitlist.
            }
            //if the serviceRegistration's id is not equal to the one we need to delete, we keep it in the new waitlist
            //(it is not filtered out)
            return true; 
        });
        if (!removedEntry) {
            return false;
        }

        //our new waitlist is the same as the old one except with the target client removed from the "queue"
        waitlist.waitlist = newWaitlist;

        //delete the entry from our database
        await GDBWaitlistEntryModel.findByIdAndDelete(removedEntry._id);

        //save the changes
        await waitlist.save();

        return true;
    } catch (e) {
        throw e;
    }
    //end of function :)))
}

module.exports = {
    pushToWaitlist,
    popFromWaitlist,
    removeFromWaitlist,
}