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
This section is for the [User-related functionality of the requirements](/reference/requirements/#user-related-functionality).
Particularly the ability to log in and out of the application.

Route | Method | Parameters | Action | Return
---|---|---|---|---
`login` | POST | email<br>password | Check the password and email and set the backend to logged in state | user account info
`login/securityQuestions/fetch` | GET | user id | | user's primary email and security questions
`login/securityQuestions/check` | POST | primary email<br>security question<br>answer | Check if the answer is correct | success
`logout` | POST | | Logs out of the session |

## register
This section is for the [User-related functionality of the requirements](/reference/requirements/#user-related-functionality).
Particularly the ability to register with the application.

Route | Method | Parameters | Action
---|---|---|---
`register/invite` | POST | email<br>superuser flag<br>expiration date | Create a temporary user and sends an email with the invitation link
`register/firstEntry/verify` | POST | jwt token (sent with the invitation email) | Check if the token was sent within 24 hours and not used already
`register/firstEntry/update` | PUT | email<br>password<br>security questions | Update the user with the provided info and set the user from temporary to permanent

## user
This section is for the [User-related functionality of the requirements](/reference/requirements/#user-related-functionality).
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
This section is for the [User-related functionality of the requirements](/reference/requirements/#user-related-functionality).
Particularly the ability to reset the password.

Route | Method | Parameters | Action
---|---|---|---
`forgotPassword/securityQuestions/fetch` | PUT |
`forgotPassword/securityQuestions/check` | POST |
`forgotPassword/sendVerificationEmail` | POST |
`forgotPassword/resetPassword/verify` | POST |
`forgotPassword/resetPassword/saveNewPassword` | POST |

## users
Route | Method | Action
---|---|---
`users` | GET |
`users/getUserProfileById/:id/` | GET

## characteristic
Route | Method | Action
---|---|---
`characteristic/fieldTypes` | GET |
`characteristic/dataTypes` | GET |
`characteristic/optionsFromClass` | GET |
`characteristics/details` | GET |
`characteristic/:id` | GET |
`characteristics` | GET |
`characteristic` | POST |
`characteristic/:id` | PUT |
`characteristic/delete/:id` | DELETE |

## dynamicForm
This section is for the [Admin functionality of the requirements](/reference/requirements/#user-related-functionality).
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
Route | Method | Action
---|---|---
`question/:id` | GET |
`questions` | GET |
`question` | POST |
`question/:id` | PUT |
`question/delete/:id` | DELETE |

## genericData
Route | Method | Action
---|---|---
`generics/:genericType` | GET |
`generic/:genericType/:id` | GET |
`generic/:genericType` | POST |
`generic/:genericType/:id` | PUT |
`generic/:genericType/:id` | DELETE |

## advancedSearch
Route | Method | Action
---|---|---
`advancedSearch/fetchForAdvancedSearch/:genericType/:genericItemType` | GET |
`advancedSearch/:genericType/:genericItemType` | PUT |

## serviceProviders
Route | Method | Action
---|---|---
`needOccurrences/client/:client` | GET |
`serviceOccurrences/service/:service` | GET |
`needSatisfiers/serviceOccurrence/:serviceOccurrence` | GET |
`needSatisfiers/service/:service` | GET |

## need
Route | Method | Action
---|---|---
`need` | POST |
`needs` | GET |
`need/:id` | DELETE |
`need/:id` | GET |
`need/:id` | PUT |

## needSatisfier
Route | Method | Action
---|---|---
`needSatisfier` | POST |
`needSatisfiers` | GET |
`needSatisfier/:id` | DELETE |
`needSatisfier/:id` | GET |
`needSatisfier/:id` | PUT |

## internalType
Route | Method | Action
---|---|---
`internalTypes/:formType` | GET |

## serviceProvision
Route | Method | Action
---|---|---
`needOccurrences/client/:client` | GET |
`serviceOccurrences/service/:service` | GET |
`needSatisfiers/serviceOccurrence/:serviceOccurrence` | GET |
`needSatisfiers/service/:service` | GET |
