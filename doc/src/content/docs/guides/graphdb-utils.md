---
title: GraphDB utils
---

:::caution
This document contains outdated information. Please see the latest documentation: https://github.com/csse-uoft/graphdb-utils
:::

The `graphdb-utils` module consists of wrappers to create GraphDB
models and manipulate data in an object-oriented way without having to worry
about the SPARQL queries. If you need to interact with GraphDB, you should
import this internal module instead of writing SPARQL queries directly.

## Examples
### Creating model
Use the GraphDBModel constructor defined [here](https://github.com/csse-uoft/graphdb-utils/blob/main/src/graphDBSchema.ts).
```js
const PrimaryContactModel = createGraphDBModel({
  first_name: String,
  last_name: String,
  position: String,
  telephone: String,
  telephone_ext: String,
  email: String,
}, {
  rdfTypes: [Types.NamedIndividual, ':primary_contact_test'],
  name: 'primary_contact_test'
});
```
Notice that each property requires a data type.
In the above example, they were all strings,
but there are a few more types we can pass in.

#### Data types
Type | Type in RDF | Example in JS | Example in RDF
---|---|---|---
Types.NamedIndividual | owl\:NamedIndividual | \:primary_contact_1 | \:primary_contact_1
Types.String or String | ^^xsd\:string | "sample string" | "sample string"
Types.Number or Number | ^^xsd\:integer<br>^^xsd\:decimal<br>^^xsd\:double | 1<br>1.3<br>1.0e6 | 1<br>1.3<br>1.0e6
Types.Date or Date | ^^xsd\:integer | Date.now() / new Date() | 1597676490573
Types.Boolean or Boolean | ^^xsd\:boolean | true<br>false | true<br>false
[String] | ^^xsd\:string | ["str1", "str2"] | "str1", "str2".

:::note
The last data type `[]` can wrap around any data type (eg. `[Number]`, `[Date]`)
to represent an array of the data type.
:::

An example model that uses these data types:
```js
const UserModel = createGraphDBModel({
  name: String,
  dob: Date,
  hobby: [String],
  validated: Boolean,
}, schemaOptions);
```
where `schemaOptions` is an object containing the keys `rdfTypes` and `name`.
See more information below.

#### Schema options
Schema options is the second parameters of `createGraphDBModel`.
It is an object containing the keys `rdfTypes` and `name`.

Key | Type | Description | Example
---|---|---|---
rdfTypes | string[] | List of value in rdf\:type | `[Types.NamedIndividual, ":primary_contact"]` for some_instance rdf\:type owl\:NamedIndividual, \:primary_contact.
name | string | Prefix of the created document | `name="primary_contact"` means the new created document will have id `:primary_contact_1`

### Adding data to the model
Adding data entries to the models defined above requires us to call the model
returned by `createGraphDBModel` with an object containing all the keys we
defined during the instantiation.

```js
const newPrimaryContact = await PrimaryContactModel({
  first_name: "Test",
  last_name: "User",
  position: "Software Developer",
  telephone: "1234567890",
  telephone_ext: "123",
  email: "user@example.com",
});
await newPrimaryContact.save();

const document = UserModel({
  name: "Parker",
  dob: Date.now(),
  hobbys: ["art", "guitar"],
  validated: false,
});
await document.save();
```

:::note[External key]
External keys are the keys of the objects when we add or search for data, such as `first_name`, `last_name`, and `dob`, as used here.
As you can see, they are the same as the keys we defined during the instantiation,
except for the key `hobbys`.
We use the key `hobbys` here despite previously defined it as `hobby` because
the type for `hobby` is an array.
The external key is automatically suffixed by an "s" when the type is an array to cover most plural forms of the word.
To manually define the external key, pass in an object of `type` and `externalKey`
instead of just the data type:
```js
const UserModel = createGraphDBModel({
  name: String,
  dob: Date,
  hobby: {type: [String], externalKey: "hobbies"},
  validated: Boolean,
}, {
  rdfTypes: [Types.NamedIndividual, ":user"],
  name: "user"
});
```
:::

This runs the following SPARQL queries:
```sparql
PREFIX : <http://cmmp#>
INSERT DATA {
  :primary_contact_1 rdf:type owl:NamedIndividual, :primary_contact;
  :has_first_name "Test";
  :has_last_name "User";
  :has_position "Software Developer";
  :has_telephone "1234567890";
  :has_telephone_ext "123";
  :has_email "user@example.com".
}

PREFIX : <http://cmmp#>
INSERT DATA {
  :user_1 rdf:type owl:NamedIndividual, :primary_contact;
  :has_name "Parker";
  :has_dob 1597676490573;
  :has_hobby "art", "guitar";
  :has_validated false;
}
```

:::note[Internal keys]
Notice the `has_` prefix in the SPARQL queries.
Here, the `:has_name`, `:has_dob`... etc are the keys in GraphDB internally,
and we call them the "internal keys"
Similar to external keys, you can manually define the internal keys using the same syntax.
For example,
```js
const UserModel = createGraphDBModel({
  name: {type: String, internalKey: ":hasName"},
  dob: Date
  hobby: {type: [String], internalKey: ":hasHobbies", externalKey: "hobbies"},
  validated: Boolean,
}, {
  rdfTypes: [Types.NamedIndividual, ":user"],
  name: "user"
});
```
:::

### Searching data
```js
const all_primary_contact = PrimaryContactModel.find({});
const primary_contacts_with_first_name = PrimaryContactModel.find({first_name: "Test"})
const primary_contact_with_email = PrimaryContactModel.find({first_name: "Test", email: "user@example.com"});
```
The SPARQL query of each of these called will be logged to `yarn start` when they are called.
The query for the last one, for example, is
```sparql
PREFIX : <http://cmmp#>
CONSTRUCT {
  ?s ?p0 ?o0
} WHERE {
  ?s ?p0 ?o0.
  ?s rdf:type owl:NamedIndividual, :primary_contact.
  ?s :has_first_name ?o0_0.
  FILTER(?o0_0 = "Test")
  ?s :has_email ?o0_3.
  FILTER(?o0_3 = "user@example.com")
}
```
