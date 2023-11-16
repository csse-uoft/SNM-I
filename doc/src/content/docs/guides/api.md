---
title: API
---

These are the internal APIs between the frontend and backend
(see [project architecture](/project-structure/#architecture)).
**All API routes below are prepended with `/api/`.**
This means that when you call the API `login/securityQuestions/fetch` from the
frontend, for example, you should actually call
`/api/login/securityQuestions/fetch`.

:::tip
You can find the implementation of each API in the file
`backend/routes/<section name>.js`.
In there, look for the function name and the module it is imported from.
The implementation should be in that module, which should be in `backend/services/`.
:::

## base
This section is for the [User section of the requirements](/reference/requirements/#user).
Particularly the ability to log in and out of the application.

Route | Method | Parameters | Action | Return
---|---|---|---|---
`login` | POST | email<br>password | Check the password and email and set the backend to logged in state | user account info
`login/securityQuestions/fetch` | GET | user id | | user's primary email and security questions
`login/securityQuestions/check` | POST | primary email<br>security question<br>answer | Check if the answer is correct | success
`logout` | POST | | Logs out of the session |

## register
This section is for the [User section of the requirements](/reference/requirements/#user).
Particularly the ability to register with the application.

Route | Method | Parameters | Action
---|---|---|---
`register/invite` | POST | email<br>superuser flag<br>expiration date | Create a temporary user and sends an email with the invitation link
`register/firstEntry/verify` | POST | jwt token (sent with the invitation email) | Check if the token was sent within 24 hours and not used already
`register/firstEntry/update` | PUT | email<br>password<br>security questions | Update the user with the provided info and set the user from temporary to permanent

## user
This section is for the [User section of the requirements](/reference/requirements/#user).
Particularly the ability to edit profile information, and to reset or edit the password.

Route | Method | Parameters | Action
---|---|---|---
`user/profile/getCurrentUserProfile/:id` | GET | email | Return all info of the user
`user/editProfile/:id` | POST | email | Update user info according to the arguments (except for the primary email)
`user/updateUserForm/:id` | POST | email | Update user info according to the non-empty arguments
`user/editProfile/updatePrimaryEmail/:id` | POST | user id<br>new email | Send a confirmation link to the new email
`user/resetPassword/checkCurrentPassword/:id` | POST | user id<br>password | Check if the password matches the current one
`user/resetPassword/saveNewPassword/:id` | POST | user id<br>password<br>email (optional) | Save the password to the account with the email or the current logged in user if no email given
`user/updatePrimaryEmail` | POST | jwt token (from the change primary email confirmation link) | Update primary email if the token is valid
`user/:id` | DELETE | user id | Delete the user (must be another user)

## forgotPassword
This section is for the [User section of the requirements](/reference/requirements/#user).
Particularly the ability to reset the password.

Route | Method
---|---
`forgotPassword/securityQuestions/fetch` | PUT
`forgotPassword/securityQuestions/check` | POST
`forgotPassword/sendVerificationEmail` | POST
`forgotPassword/resetPassword/verify` | POST
`forgotPassword/resetPassword/saveNewPassword` | POST

## users
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to browse all user profiles.
Route | Method | Action
---|---|---
`users` | GET | Return all user profiles
`users/getUserProfileById/:id/` | GET | Return the user profile of the specified user id

## characteristic
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to create/edit/delete characteristics.
Route | Method
---|---
`characteristic/fieldTypes` | GET
`characteristic/dataTypes` | GET
`characteristic/optionsFromClass` | GET
`characteristics/details` | GET
`characteristic/:id` | GET
`characteristics` | GET
`characteristic` | POST
`characteristic/:id` | PUT
`characteristic/delete/:id` | DELETE

## dynamicForm
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to manage forms and form items.

Route | Method | Action
---|---|---
`dynamicForm` | POST | Create a form
`dynamicForm` | GET | Get all forms
`dynamicForm/:id` | PUT | Update a form
`dynamicForm/:id` | GET | Get a form
`dynamicForm/:id` | DELETE | Delete a form
`dynamicForm/:formType` | GET | Get a set of forms by form type
`dynamicClassInstances/:class` | GET |
`label/:uri` | GET | Get the label of a URI

## question
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to create/edit/delete questions.
Route | Method
---|---
`question/:id` | GET
`questions` | GET
`question` | POST
`question/:id` | PUT
`question/delete/:id` | DELETE

## genericData
Route | Method
---|---
`generics/:genericType` | GET
`generic/:genericType/:id` | GET
`generic/:genericType` | POST
`generic/:genericType/:id` | PUT
`generic/:genericType/:id` | DELETE

## Search
The genericType GET routes are used for getting all the generic items of a certain type.
If we pass another parameter, searchitem, we can search for a specific string.

Route | Method
---|---
`genericSearch/:genericType?searchitem=item` | GET

Example
`/api/generics/program?searchitem=AAA` can be used to search program that contains 'AAA' or 
program that have a attribute that contains 'AAA'.

The query are down below. It uses FTS GraphDB searching function and 
Lucene Connector searching function. We use both of them in case one of them misses some data.

Services:
```sparql
PREFIX onto: <http://www.ontotext.com/>
PREFIX tove_org: <http://ontology.eil.utoronto.ca/tove/organization#>
PREFIX : <http://snmi#>

PREFIX luc: <http://www.ontotext.com/connectors/lucene#>
PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select distinct ?e0
where 
{
    BIND("Ben" AS ?searchitem)
    
    # Search for rdf such that entity is the type of :Service
    {
        ?e0 ?p0 ?o0 .
        ?e0 rdf:type :Service .
    }.
    
    # The FTS function searching part
    {
        ?o0 onto:fts ?searchitem .
    }
    UNION
	{   
        ?o0 ?p1 ?o1 .
    	?o1 onto:fts ?searchitem .
	}
    # The connector searching part
    UNION
    {?search a luc-index:service_connector ;
      luc:query ?searchitem ;
      luc:entities ?e0 .
    }
    UNION
    {?search a luc-index:characteristicoccurrence_connector ;
      luc:query ?searchitem ;
      luc:entities ?o0 .
    }
    UNION

    {?search a luc-index:address_connector ;
      luc:query ?searchitem ;
      luc:entities ?o0 .
    }
}
```

Programs:
```sparql
PREFIX onto: <http://www.ontotext.com/>
PREFIX tove_org: <http://ontology.eil.utoronto.ca/tove/organization#>
PREFIX : <http://snmi#>

PREFIX luc: <http://www.ontotext.com/connectors/lucene#>
PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select distinct ?e0
where 
{
    BIND("S5*" AS ?searchitem)
    
    # Search for rdf such that entity is the type of :Service
    {
        ?e0 ?p0 ?o0 .
        ?e0 rdf:type :Program .
    }.
        # The FTS function searching part
    {
        ?o0 onto:fts ?searchitem .
    }
    UNION
	{   
        ?o0 ?p1 ?o1 .
    	?o1 onto:fts ?searchitem .
	}
    # The connector searching part
    UNION
    {?search a luc-index:program_connector ;
      luc:query ?searchitem ;
      luc:entities ?e0 .
    }
    UNION
    {?search a luc-index:characteristicoccurrence_connector ;
      luc:query ?searchitem ;
      luc:entities ?o0 .
    }
    UNION
    {?search a luc-index:address_connector ;
      luc:query ?searchitem ;
      luc:entities ?o0 .
    }
}
```

## advancedSearch
Route | Method
---|---
`advancedSearch/fetchForAdvancedSearch/:genericType/:genericItemType` | GET
`advancedSearch/:genericType/:genericItemType` | PUT

## serviceProviders
This section is for the
[Service provider management](/refere/cerequirements/#service-provider-management)
and the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to create and manage needs.
Route | Method | Parameters | Action
---|---|---|---
`providers` | POST | Provider type<br>Service provider data | Create a service provider
`providers` | GET || Fetch all service providers
`providers/:id` | GET || Fetch the service provider with the specified ID
`providers/:id` | DELETE || Delete the service provider with the specified ID
`provider/:id` | PUT | Provider type<br>Service provider data | Update the service provider with the specified ID using the information in the given form

## need
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to create and manage needs.
Route | Method | Parameters | Action
---|---|---|---
`need` | POST | Need form | Create a need
`needs` | GET || Fetch all needs
`need/:id` | DELETE || Delete the need with the specified ID
`need/:id` | GET || Fetch the need with the specified ID
`need/:id` | PUT | Need form | Update the need with the specified ID using the information in the given form

## needSatisfier
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to create and manage need satisfiers.
Route | Method | Parameters | Action
---|---|---|---
`needSatisfier` | POST | Need satisfier form | Create a need satisfier
`needSatisfiers` | GET || Fetch all need satisfiers
`needSatisfier/:id` | DELETE || Delete the need satisfier with the specified ID
`needSatisfier/:id` | GET || Fetch the need satisfier with the specified ID
`needSatisfier/:id` | PUT | Need satisfier form | Update the need satisfier with the specified ID using the information in the given form

## outcome
This section is for the [Admin section of the requirements](/reference/requirements/#admin).
Particularly the ability to create and manage outcomes.
Route | Method | Parameters | Action
---|---|---|---
`outcome` | POST | Outcome form | Create an outcome
`outcomes` | GET || Fetch all outcomes
`outcome/:id` | DELETE || Delete the outcome with the specified ID
`outcome/:id` | GET || Fetch the outcome with the specified ID
`outcome/:id` | PUT | Outcome form | Update the outcome with the specified ID using the information in the given form

## internalType
Route | Method
---|---
`internalTypes/:formType` | GET

## serviceProvision
Route | Method
---|---
`needOccurrences/client/:client` | GET
`serviceOccurrences/service/:service` | GET
`needSatisfiers/serviceOccurrence/:serviceOccurrence` | GET
`needSatisfiers/service/:service` | GET
