---
title: External dependencies
---

## Node packages
- The frontend application is built with [React.js](https://react.dev/).
  You may find this [reference on react hooks](https://react.dev/reference/react) helpful.
- The frontend components use [Material UI](https://mui.com/).
  You may find the "Components" and "Component API" section of the
  [documentation](https://mui.com/material-ui/getting-started/) helpful.
- [Express.js](https://expressjs.com/) is used to serve the backend APIs.
  You may find this [routing guide](https://expressjs.com/en/guide/routing.html) helpful.

## Data storage technologies
### MongoDB
We use MongoDB to store user information,
[mongoose](https://mongoosejs.com/) for modelling the data,
and [mongoose-gridfs](https://www.npmjs.com/package/mongoose-gridfs) for
using the [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) API.

### Ontotext GraphDB
We use GraphDB to store the rest of the data.
The GraphDB interface can be accessed at http://localhost:7200 after you start the docker container.
You can use the interface to write SPARQL queries.
There will be a tutorial for the interface the first time you launch it.

#### RDF (Resource Description Framework)
[RDF](https://graphdb.ontotext.com/documentation/10.0/devhub/rdfs.html)
is a framework and a standard for representing and describing information on the web.

In RDF, information is represented using triples, consisting of three parts:
- **Subject:** The resource being described
- **Predicate:** The attribute of the resource
- **Object:** The value or target of the attribute

For example, a user named Parker with the user id of 1 can be represented as the following:
- **Subject:** user_1
- **Predicate:** hasName
- **Object:** Parker

Parker may have other attributes, such as age, represented in another triple:
- **Subject:** user_1
- **Predicate:** hasAge
- **Object:** 21

#### SPARQL
[SPARQL](https://graphdb.ontotext.com/documentation/10.0/devhub/sparql.html)
is a query language for RDF data.

Here are some examples of SPARQL queries corresponding to the javascript code:

##### Find all primary contacts
```js
const all_primary_contact = PrimaryContactModel.find({})
```
```sparql
PREFIX : <http://cmmp#>
CONSTRUCT {
  ?s ?p0 ?o0
} WHERE {
  ?s ?p0 ?o0.
  ?s rdf:type owl:NamedIndividual, :primary_contact.
}
```

#### Find all primary contacts with the last name Parker
```js
const primary_contacts_with_last_name = PrimaryContactModel.find({last_name: "Parker"})
```
```sparql
PREFIX : <http://cmmp#>
CONSTRUCT {
  ?s ?p0 ?o0
} WHERE {
  ?s ?p0 ?o0.
  ?s rdf:type owl:NamedIndividual, :primary_contact.
  ?s :has_last_name ?o0_0.
  FILTER(?o0_0 = "Parker")
}
```

#### Find a primary contact with the last name Parker and the email <user@example.com>
```js
const primary_contact_with_email = PrimaryContactModel.find({last_name: "Parker", email: "user@example.com"})
```
```sparql
PREFIX : <http://cmmp#>
CONSTRUCT {
  ?s ?p0 ?o0
} WHERE {
  ?s ?p0 ?o0.
  ?s rdf:type owl:NamedIndividual, :primary_contact.
  ?s :has_last_name ?o0_0.
  FILTER(?o0_0 = "Parker")
  ?s :has_email ?o0_3.
  FILTER(?o0_3 = "user@example.com")
}
```
