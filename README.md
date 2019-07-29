## Project Overview

Service Needs Marketplace is an application conceived of by the [Centre for Social Services Engineering](http://csse.utoronto.ca/) at the University of Toronto. Its meant to be used by Canadian newcomer settlement service providers (e.g. JIAS Toronto, North York Community House, YMCA, etc.), to help them match newcomers to Canada with the resources (both services and goods) they need access to.

This code base, together with [snm-server](https://github.com/leonL/snm-server), is an MVP implementation of the app. As of this writing the CSSE is using a [staging deployment](https://secret-island-33471.herokuapp.com/clients/) of SNM as part of their pitch to service providers and other interested parties.

## Running SNM in your development environment

This web client is built using React and Redux. It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). A local instance of the client can be launched with the command `npm start` after cloning the repo and building its dependency library. If you're not sure what that means, or are having trouble getting it going, consult the [Create React App User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

The client is designed to operate in conjunction with a deployment of [snm-server](https://github.com/leonL/snm-server). The server host URL can be configured in `src/store/defaults.js`. The host is currently set to a Heroku staging instance of snm-server on the master branch, and to a local instance on the development branch. If you'd like to run the full SNM stack in your local development environment, get [snm-server](https://github.com/leonL/snm-server) running first, and set the serverHost value in `src/store/defaults.js` to its address.  

## If you are a developer building on this code...

### Consider a redesign / refactor of the following code structures before adding to them or writing new code that relies upon them significantly

#### Components related to both `needs` and their `requirements` and `resources` and their `details`. 

`Needs` and `resources` are principle objects of Service Needs Marketplace and are fundamentally correlated: the whole point of the system is to find `resources (services or goods)` that match and can satisfy `clients' needs`. The current implementation represents this relationship in the most literal way: both objects have a `type` field, and a hash field representing relevant characteristics, called `requirements` in the case of `needs`, and `details` in the case of `resources`. A `resource` is recommended for a given `need` if the `types` match, and its `details` match the laters `requirements`. 

It follows that the components that render views and forms related to both types of objects are very similar. The component code relevant to these objects has been written naively, that is without attempting to aggregate and modularize the common elements and functionality, in order to make the patterns explicit before doing so. This approach is no longer sustainable; the code in question needs to be simplified before it is expanded upon. When doing so consider what types of `needs/resources` the app might support in the future, as well as what would be required to support users being able to create custom types of both.
To make sure you've taken into consideration all the components that are affected by these constructs, see all the subfolders in the `components` folder that contain files named `Generic*.js`.

#### Data index views and forms

Three top level components (defined in `Clients.js`, `Providers.js`, and `Resources.js`) are almost identical in their layout and behaviour. They are index views of the principle data in the system, and expose CRUD functionality for their relevant members. 
There is ample code repetition between these components that should be modularized or abstracted into single components. Before doing so give some thought to the conceptual relationship between `providers` and their `resources`. It's likely that these two index views will be incorporated into one as the app matures given their close relationship.

#### Data fetching functions

As well as defining most of the Redux actions available in the app so far, `src/store/actions.js` defines a number of functions that are used to request and post data to the server. The common logic of these functions can and should be abstracted into generic functions. It might also be worth restructuring these methods as a common API available to the components, where the top level functions are not specific to the type of data being handled (as they are currently). 

#### Bloated data store definition files

The data store `actions.js` and `reducers.js` files are unwieldily due to their size. They should be broken down into smaller files categorized by the principe object the actions/reducers are concerned with. See the files `needActions.js` and `needReducers.js` as an example of how you might proceed. 

### Notice that tests are currently absent from the code base

This was a questionable sacrifice made in the name of building the MVP as quickly as possible. The code base has reached the threshold where a developer familiar with it might be able to anticipate all the serious consequences of making changes or adding to it. It is highly encouraged to start adding test coverage to the app from this point forward. 

### Layout and style definitions

Extensive use of React-Bootstrap has been made to define the layout and style of the application. In the case of custom defined styles, they are written as SASS. A different structure for defining custom styles would likely be easy to transition to at this point, if desired, as their aren't very many so far.

### Configure the variables "CHANGETHISVARIABLE" in the following file(s) before deploying:
./src/store/defaults.js
./package.json
