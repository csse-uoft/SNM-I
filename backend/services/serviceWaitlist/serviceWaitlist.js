const {GDBServiceRegistrationModel} = require("../../models");
const { GDBServiceWaitlistModel} = require("../../models/service/serviceWaitlist");
const { GDBwaitlistEntryModel, GDBWaitlistEntryModel} = require("../../models/service/waitlistEntry");


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


const pushToWaitlist = async (req, res, next) => {
    //probably need some more security checks to make sure that what I'm about to operate on safe data. 
    //Will touch this up later as I just need things to work at the moment.

    //get id of the serviceOccurrence

    const{id} = req.params;

    //SHOULD contain the id of the client and their priority
    const form = req.body;

    try{
        
        //grab the waitlist, and the corresponding client to be registered
        const waitlist = GDBServiceWaitlistModel.findOne({'serviceOccurrence._id': id});
        const serviceRegistration = await GDBServiceRegistrationModel.findById(form.serviceRegistrationId);


        //create a new entry, this will be added to our waitlist
        const newEntry = GDBWaitlistEntryModel({'serviceRegistration': serviceRegistration, 'priority': form.priority, 'date': date});

        //save this new entry to the db
        await newEntry.save();


        //now begin insertion:


        //try to find the index of the first element in the "waitlist" attribute
        //whose priority is greater than the priority of our new entry into the waitlist, as highest
        //priority = lower number
        let insertionIndex = waitlist.waitlist.findIndex(entry => entry.priority > newEntry.priority);

        //in the event that no index is found, add our value to the end of the waitlist:
        if (index === -1){
            waitlist.waitlist.push(newEntry);
        }else{
            //now we need to find where the last index is with the same priority as the new registration
            //this is because if someone was already there with the same priority as the new registration,
            //they should go first still
            while (insertionIndex < waitlist.waitlist.length && waitlist.waitlist[insertionIndex].priority === newEntry.priority){
                index ++; //just incrementing until we find where we need to insert
            } 

            //insert the new registration to where it belongs
            waitlist.waitlist.splice(waitlistIndex, 0, newEntry);
        }
        
        //save the changes made to this waitlist after insertion
        await waitlist.save();

        //successfully inserted registration into waitlist
        return res.status(200).json({success:true});




    }catch (e){
        //not sure what this is, should ask
        next(e);
    }
    //end of function :)))
}


/*given a serviceOccurrence, remove and return the registration (as a waitlistEntry) of the client that is next in line 
from the serviceOccurrence's correspondingwaitlist. See the notes above on top of pushToWaitlist().

assume that we have:
1. the serviceOccurrence id: req.params.id
 */
const popFromWaitlist = async (req, res, next) => {
    //again, might need to do some checks/security measures to make sure we
    //aren't doing anything we aren't supposed to, will do this later
    
    const{id} = req.params;
    
    try{
        //get the waitlist we need to modify
        const waitlist = GDBServiceWaitlistModel.findOne({'serviceOccurrence._id': id});

        //go into our waitlist, pop out the item in the front of our list/queue (since we are sorting)
        //from ascending priority where the lowest priority value = the client that should get off the waitlist first
        const dequeuedEntry = waitlist.waitlist.shift();

        //now delete the item
        await GDBWaitlistEntryModel.findByIdAndDelete(dequeuedEntry.id);
        //TODO: ASK IF THIS IS THE RIGHT WAY TO GET THE ID FROM AN OBJECT, NOT SURE IF THIS IS RIGHT OR NOT

        //now return success and the thing that just got deleted:
        return res.status(200).json({success: true, dequeuedEntry});
    }catch (e){
        next(e);
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
const removeFromWaitlist = async (req, res, next) => {
    // like the other two function, I may need to do some checks sure we're not doing any
    //operations that are invalid, or on things that do not exist.

    const {id} = req.params;
    const form = req.body;


    try{

        //get the waitlist we need to modify 
        const waitlist = GDBServiceWaitlistModel.findOne({'serviceOccurrence._id': id});

        //now we go through the waitlist and find where the client we need to delete is based
        //on the given id.

        let removedEntry;
        const newWaitlist = waitlist.waitlist.filter(entry => {
            if (entry.serviceRegistration._id === form.serviceRegistrationId){
                removedEntry = entry; //save this so we can delete the registration from the db as well
                return false; //returning false means that the item we are deleting is no long in the waitlist.
            }
            //if the serviceRegistration's id is not equal to the one we need to delete, we keep it in the new waitlist
            //(it is not filtered out)
            return true; 
        });

        //our new waitlist is the same as the old one except with the target client removed from the "queue"
        waitlist.waitlist = newWaitlist;

        //delete the entry from our database
        await GDBwaitlistEntryModel.findByIdAndDelete(removedEntry._id);

        //save the changes
        await waitlist.save();

        //indicate that the target client's registration in the waitlsit has been successfully deleted 
        return res.status(200).json({success:true});


    }catch (e){
        next(e);
    }
    //end of function :)))


}