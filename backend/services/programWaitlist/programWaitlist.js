const {GDBProgramRegistrationModel} = require("../../models/programRegistration");
const {GDBProgramWaitlistModel} = require("../../models/program/programWaitlist");
const {GDBProgramWaitlistEntryModel} = require("../../models/program/programWaitlistEntry");

/*

given a programOccurrence ID and some programRegistration ID in "req.params", as well as priority (Number), and date (Date)
in "req.body" (see /backend/models/program/waitlistEntry.js),
add this new registration on the waitlist accordingly.
That is, we should have three attributes:

1. the id of the programOccurrence: req.params.id
2. the id of the programRegistration to be inserted: req.body.programRegistrationId
3. the priority this registration will have in the waitlist: req.body.priority
4. the date the registration was made: req.body.date

Waitlist insertion is based on specified priority.
Note that for now I am treating priority as a number (see the waitlistEntry model)
where a smaller number has more priority (like ranking/tiers, e.g. tier 1, tier 2, ..., tier n etc. 
where tier 1 is the highest priority). Date could theoretically be used to determine the priority
however this can/will be added in a future update.

*/


const pushToWaitlist = async (id, programRegistrationId, priority, date) => {
  try {
    //grab the waitlist, and the corresponding client to be registered
    const waitlist = await GDBProgramWaitlistModel.findOne({'programOccurrence': {_id: id}});
    const programRegistration = await GDBProgramRegistrationModel.findById(programRegistrationId);
    //create a new entry, this will be added to our waitlist
    const newEntry = GDBProgramWaitlistEntryModel({'programRegistration': programRegistration, 'priority': priority, 'date': date});
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
}


/*given a programOccurrence, remove and return the registration (as a waitlistEntry) of the client that is next in line 
from the programOccurrence's correspondingwaitlist. See the notes above on top of pushToWaitlist().

assume that we have:
1. the programOccurrence id: req.params.id
 */
const popFromWaitlist = async (id) => {
  try {
    //get the waitlist we need to modify
    const waitlist = await GDBProgramWaitlistModel.findOne({'programOccurrence': {_id: id}},
    {
      populates: ['programOccurrence.characteristicOccurrences', 'waitlist', 'waitlist.programRegistration',
      'waitlist.programRegistration.characteristicOccurrences']
    });
    //go into our waitlist, pop out the item in the front of our list/queue (since we are sorting)
    //from ascending priority where the lowest priority value = the client that should get off the waitlist first
    const dequeuedEntry = waitlist.waitlist?.shift();
    await waitlist.save();
    if (!dequeuedEntry) {
      return null;
    }
    const programRegistration = dequeuedEntry.programRegistration;

    //now delete the item
    await GDBProgramWaitlistEntryModel.findByIdAndDelete(dequeuedEntry._id);
    //now return success and the thing that just got deleted:
    return programRegistration;
  } catch (e) {
    throw e;
  }
}




/*given a programOccurrence ID and the id 
of a programRegistration that must be dequeued from it, delete the registration (waitlistEntry) 
from the queue. See the notes above on top of pushToWaitlist().

assume that we will get the following from req:

1. the programOccurrence id: req.params.id
2.the id of the programRegistration that needs to be removed from the waitlist: req.body.programRegistrationId


*/
const removeFromWaitlist = async (id, programRegistrationId) => {
  try {

    //get the waitlist we need to modify 
    const waitlist = await GDBProgramWaitlistModel.findOne({'programOccurrence': {_id: id}}, {populates: ['waitlist']});

    //now we go through the waitlist and find where the client we need to delete is based
    //on the given id.

    let removedEntry;
    const newWaitlist = waitlist.waitlist?.filter(entry => {
      if (entry.programRegistration?.split('_')[1] === programRegistrationId){
        removedEntry = entry; //save this so we can delete the registration from the db as well
        return false; //returning false means that the item we are deleting is no long in the waitlist.
      }
      //if the programRegistration's id is not equal to the one we need to delete, we keep it in the new waitlist
      //(it is not filtered out)
      return true; 
    });
    if (!removedEntry) {
      return false;
    }

    //our new waitlist is the same as the old one except with the target client removed from the "queue"
    waitlist.waitlist = newWaitlist;
    //delete the entry from our database
    await GDBProgramWaitlistEntryModel.findByIdAndDelete(removedEntry._id);
    //save the changes
    await waitlist.save();

    return true;
  } catch (e) {
    throw e;
  }
}

module.exports = {
    pushToWaitlist,
    popFromWaitlist,
    removeFromWaitlist,
}