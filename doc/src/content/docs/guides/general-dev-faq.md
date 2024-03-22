---
title: General FAQ For New Developers
---

This guide has been written for those who are new to the codebase and are unsure of where to start or where to look. This was last updated on March 22, 2024.


## I need to create a new model for something, where do I do this and how should I start?
All models are kept in `/backend/models`. Let's take a look at an example:

```js
const GDBServiceWaitlistEntryModel = createGraphDBModel({
  serviceRegistration: {type: GDBServiceRegistrationModel, internalKey: ':hasServiceRegistration'},
  priority: {type: Number, internalKey: ':hasPriority'},
  date: {type: Date, internalKey: ':hasDate'},
},
{  
  rdfTypes: [':ServiceWaitlistEntry'], name: 'serviceWaitlistEntry'
});
```
(Hint: you can see more examples of models in the "Data Model" guide)

Here we are setting our model-creation function as a particular function call of `createGraphDBModel()`. This model is used as an entry for a service waitlist model that is used by a service occurrence (although this detail is not entirely necessary). note that first, we are passing in a JavaScript object containing all of the attributes we wish to have in the model. First, we have the "serviceRegistration", which is another model defined in `/backend/ServiceRegistration.js`. We can also use other predefined types like "Number" or "Date". In the second object, we are essentially declaring the name of this type of model.

You may also have to modify the following files. Observe how other models are specified for them, as it is quite long (and relatively straightforward) to explain for a short FAQ question:

1. `/backend/services/characteristics/predefined/internalTypes.js`
2. `/backend/services/genericData/index.js`
3. `/frontend/src/constants/provider_fields.js`
4. `/frontend/src/routes.js`

## I have a model that I need to be able to create, modify, and display a page from the drop-down menu, what should I do?
There are a couple of things you would need to do:

1. Setup routes for your model at `/frontend/src/Routes.js`
2. Add your model as an option for the overview drop-down menu at `/frontend/src/components/layouts/TopNavbar.js`
3. Create a form, overview page, and visualizer. As examples, check out: 

    i. `/frontend/src/components/serviceOccurrence/ServiceOccurrence.js`
    ii.`/frontend/src/components/ServiceOccurrences.js`
    iii. `/frontend/src/components/serviceOccurrence/visualizeServiceOccurrence.js`
respectively.




## What is a "snackbar"?
This is the notification centre of the web application. These notifications appear temporarily and disappear after a set number of time, this is used to display confirmations, errors, etc. to the user when they use the site.


## I need to make a form for a new model, but I'm not sure where to start.
Check out `/frontend/src/components/serviceOccurrence/ServiceOccurrence.js` as an example. We basically create a function to specify the specific features of the form, then return a modified React component ("GenericForm" from `/frontend/src/components/shared/GenericForm.js`)


## How do I set up an overview page for a new model that I created?
You can find many examples of this, check out some examples at `/frontend/src/components/programWaitlist/programWaitlists.js` or `/frontend/src/components/Clients.js` to name a few.


## The frontend overview from one of the models in the drop-down menu is displaying a weird link or code instead of what I want. Why?
If you are referencing a value from another model that is stored in your own model, you need to make an API call to reference this value. Example:
```js
const columnsWithoutOptions = [
  {
    label: 'ID',
    body: ({_id}) => {
      console.log(_id);
      console.log(<Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>);

      return <Link color to={`/${TYPE}/${_id}/edit`}>{_id}</Link>
    }
  },
  ];
```


## How do I make sure that the API features I set up are correct?
You can use apps made to test web APIs like [Postman](https://www.postman.com/). This application allows you to make API calls and view the HTTP Response that was sent from the backend server.


## What is a route? How do I set one up?
A route is an endpoint (defined by some sort of URL that you specify) that is mapped to a particular function in the backend server. This is done via HTTP (Hypertext Transfer Protocol). This forms our API (Application Programming Interface), and can be used to request, update, create, and delete information (CRUD). You will find how to create routes on the frontend in `/frontend/src/routes.js`. 


## I'm testing some things locally using the frontend application. When I try to create a new instance of an object/model it just says "No form available", why?

When you created a new docker image for your databases, no forms are pre-loaded in. Click the profile picture icon on the top right of the window and click "dashboard". There you can click "Manage Forms", select the model you want to make a form for and customize it as necessary.




