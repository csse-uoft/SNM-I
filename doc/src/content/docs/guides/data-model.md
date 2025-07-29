---
title: Data model
---

This page shows all the data models created by `createGraphDBModel`.
To understand what each attribute and option means in the definition of these models,
you should be familiar with the parameters and types of GraphDB utils first.
If not, please have a look at [GraphDB utils](/guides/graphdb-utils/) before continuing.

The content is a copy and pasted version of the source code.
You can find them in `backend/models/`.
If you find any outdated information,
it will be appreciated if you update this page :)

## Address
```js
const GDBAddressModel = createGraphDBModel({
  lat: {type: String, internalKey: 'geo:lat'},
  lng: {type: String, internalKey: 'geo:long'},

  // iContact Ontology defines the type as nonNegativeNumber,
  // but this should be a string since some unit numbers are not just pure number.
  unitNumber: {type: String, internalKey: 'ic:hasUnitNumber'},

  streetNumber: {type: String, internalKey: 'ic:hasStreetNumber'},
  streetName: {type: String, internalKey: 'ic:hasStreet'},
  streetType: {type: GDBStreetType, internalKey: 'ic:hasStreetType'},
  streetDirection: {type: GDBStreetDirection, internalKey: 'ic:hasStreetDirection'},

  city: {type: String, internalKey: 'ic:hasCityS'},
  citySection: {type: String, internalKey: 'ic:hasCitySection'},
  country: {type: GDBSchemaCountry, internalKey: 'ic:hasCountry'},
  state: {type: GDBSchemaState, internalKey: 'ic:hasState'},
  postalCode: {type: String, internalKey: 'ic:hasPostalCode'},

}, {
  rdfTypes: ['ic:Address'], name: 'address'
});
```

### Country
```js
const GDBSchemaCountry = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  code: {type: String, internalKey: 'ic:hasISO3166Code'}
}, {rdfTypes: ['schema:Country'], name: 'country'});
```

### State
```js
const GDBSchemaState = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  code: {type: String, internalKey: 'ic:hasISO3166Code'}
}, {rdfTypes: ['schema:State'], name: 'state'});
```

### Street type
```js
const GDBStreetType = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
}, {rdfTypes: ['ic:StreetType'], name: 'streetType'});
```

### Direction
```js
const GDBStreetDirection = createGraphDBModel({
  label: {type: String, internalKey: 'rdfs:label'},
  code: {type: String, internalKey: 'ic:hasISO3166Code'}
}, {rdfTypes: ['ic:StreetDirection'], name: 'streetDirection'});
```

## Phone number
```js
const GDBPhoneNumberModel = createGraphDBModel({
  areaCode: {type: Number, internalKey: 'ic:hasAreaCode'},
  countryCode: {type: Number, internalKey: 'ic:hasCountryCode'},
  phoneNumber: {type: Number, internalKey: 'ic:hasPhoneNumber'},
  phoneType: {type: Types.NamedIndividual, internalKey: 'ic:hasPhoneType'},
}, {rdfTypes: ['ic:PhoneNumber'], name: 'phoneNumber'});
```

## Person
```js
const GDBPersonModel = createGraphDBModel({
  familyName: {type: String, internalKey: 'foaf:familyName'},
  givenName: {type: String, internalKey: 'foaf:givenName'},
  middleName: {type: String, internalKey: 'foaf:middleName'},
  formalName: {type: String, internalKey: 'foaf:formalName'},
  address: {type: GDBAddressModel, internalKey: 'ic:hasAddress', onDelete: DeleteType.CASCADE},
  gender: {type: Types.NamedIndividual, internalKey: 'cwrc:hasGender'},
  email: {type: String, internalKey: 'ic:hasEmail'},
  altEmail: {type: String, internalKey: 'ic:hasAltEmail'},
  telephone: {type: GDBPhoneNumberModel, internalKey: 'ic:hasTelephone', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: ['cids:Person'], name: 'person'
});
```

## Service provider
```js
const GDBServiceProviderModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  organization: {type: GDBOrganizationModel, internalKey: ':hasOrganization'},
  volunteer: {type: GDBVolunteerModel, internalKey: ':hasVolunteer'},
  characteristicOccurrences: {type: [GDBCOModel], internalKey: ':hasCharacteristicOccurrence'}
}, {
  rdfTypes: [':ServiceProvider'], name: 'serviceProvider'
});
```

## Hours of operation
```js
const GDBHoursOfOperationModel = createGraphDBModel({
  dateSchedules: {type: [GDBDateScheduleModel], internalKey: ':hasDateSchedule'},
  weekSchedules: {type: [GDBWeekScheduleModel], internalKey: ':hasWeekSchedule'}
}, {
  rdfTypes: [':HoursOfOperation'], name: 'hoursOfOperation'
});
```

### Date schedule
```js
const GDBDateScheduleModel = createGraphDBModel({
  hasDate: {type: Date, internalKey: 'hasDate'},
  timeIntervals: {type: [GDBTimeIntervalModel], internalKey: ':hasTimeInterval'}
}, {
  rdfTypes: [':DateSchedule'], name: 'dateSchedule'
});

const GDBTimeIntervalModel = createGraphDBModel({
  startTime: {type: Date, internalKey: 'hasStartTime'},
  endTime: {type: Date, internalKey: 'hasEndTime'}
}, {
  rdfTypes: [':TimeInterval'], name: 'timeInterval'
});
```

### Week schedule
```js
const GDBWeekScheduleModel = createGraphDBModel({
  startDate: {type: Date, internalKey: 'hasStartDate'},
  endDate: {type: Date, internalKey: 'hasEndDate'},
  daySchedule: {type: GDBDayScheduleModel, internalKey: 'hasDaySchedule'}
}, {
  rdfTypes: [':WeekSchedule'], name: 'WeekSchedule'
});

const GDBDayScheduleModel = createGraphDBModel({
  dayOfWeek: {type: Types.NamedIndividual, internalKey: 'hasDayOfWeek'},
  timeInterval: {type: GDBTimeIntervalModel, internalKey: 'hasTimeInterval'}
}, {
  rdfTypes: [':DaySchedule'], name: 'daySchedule'
});
```

## User account
```js
const GDBUserAccountModel = createGraphDBModel({
  // Primary email if for logging in, resetting password and used for communication. (everything)
  primaryEmail: {type: String, internalKey: ':hasPrimaryEmail'},
  // Secondary email is for recovery
  secondaryEmail: {type: String, internalKey: ':hasSecondaryEmail'},
  hash: {type: String, internalKey: ':hasHash'},
  salt: {type: String, internalKey: ':hasSalt'},
  displayName: {type: String, internalKey: ':hasDisplayName'},
  organization: {type: GDBOrganizationModel, internalKey: 'cp:hasOrganization'},

  // Person information
  // firstName: givenName
  // lastName: familyName
  primaryContact: {type: GDBPersonModel, internalKey: ':hasPrimaryContact', onDelete: DeleteType.CASCADE},

  role: {type: String, internalKey: ':hasAccountRole'},
  positionInOrganization: {type: String, internalKey: ':hasPositionInOrganization'},

  expirationDate: {type: Date, internalKey: ':hasExpirationDate'},
  status: {type: String, internalKey: ':hasAccountStatus'},

  // Exact 3 questions, the answer should be case-insensitive.
  securityQuestions: {type: [GDBSecurityQuestion], internalKey: ':hasSecurityQuestion', externalKey: 'securityQuestions', onDelete: DeleteType.CASCADE}

}, {
  rdfTypes: [':UserAccount'], name: 'userAccount'
});
```

### Security question
```js
const GDBSecurityQuestion = createGraphDBModel({
  question: {type: String, internalKey: ':hasSecurityQuestion'},
  // The answer should be case-insensitive.
  // The answer should be hashed
  hash: {type: String, internalKey: ':hasHash'},
  salt: {type: String, internalKey: ':hasSalt'},
}, {rdfTypes: [':SecurityQuestion'], name: 'securityQuestion'});
```

## Client functionalities
### Characteristic
```js
const GDBCharacteristicModel = createGraphDBModel({
  description: {type: String, internalKey: 'cids:hasDescription'},
  name: {type: String, internalKey: ':hasName'},
  codes: {type: [Types.NamedIndividual], internalKey: 'cids:hasCode'},
  // predefined characteristics (i.e. firstName, lastName) link to properties that already defined in compass Ontology.
  predefinedProperty: {type: Types.NamedIndividual, internalKey: ':hasPredefinedProperty'},
  isPredefined: {type: Boolean, internalKey: ':isPredefined'},
  implementation: {type: GDBFIIModel, internalKey: ':hasFormItemImplementation', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':characteristics'], name: 'characteristic'
});
```

### Form item implementation
```js
const GDBFIIModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  multipleValues: {type: Boolean, internalKey: ':hasMultipleValues'},
  valueDataType: {type: Types.NamedIndividual, internalKey: ':hasValueDataType'},
  fieldType: {type: GDBFieldTypeModel, internalKey: ':hasFieldType'},
  // store options as [{}, {}, {}]
  options: {type: [GDBOptionModel], internalKey: ':hasOption', onDelete: DeleteType.CASCADE},
  //required:{type: Boolean, internalKey: ':isRequired'},
  optionsFromClass: {type: Types.NamedIndividual, internalKey: ':hasOptionsFromClass'},
}, {
  rdfTypes: [':FormItemImplementation'], name: 'formItemImplementation'
});
```

### Field type
```js
const GDBFieldTypeModel = createGraphDBModel({
  type: {type: String, internalKey: ':hasType'},
  label: {type: String, internalKey: ':hasLabel'}
}, {rdfTypes: [':FieldType'], name: 'fieldType'});
```

### Option
```js
const GDBOptionModel = createGraphDBModel({
  label: {type: String, internalKey: ':hasLabel'},
  dataValue: {type: String, internalKey: ':hasDataValue'},
  objectValue: {type: Types.NamedIndividual, internalKey: ':hasObjectValue'}

}, {rdfTypes: [':Option'], name: 'option'})
```

### Question occurrence
```js
const GDBQOModel = createGraphDBModel({
  stringValue: {type: String, internalKey: ':hasStringValue'},
  occurrenceOf: {type: GDBQuestionModel, internalKey: ':occurrenceOf'},
}, {
  rdfTypes: [':QuestionOccurrence'], name: 'questionOccurrence'
});
```

### Client
```js
const GDBClientModel = createGraphDBModel({
  characteristicOccurrences: {type: [GDBCOModel],
    internalKey: ':hasCharacteristicOccurrence', onDelete: DeleteType.CASCADE},
  questionOccurrences: {type: [GDBQOModel],
    internalKey: ':hasQuestionOccurrence', onDelete: DeleteType.CASCADE},
  needs: {type: [GDBNeedModel], internalKey: ':hasNeed'},
  // If a need is added, need occurrence is automatically created and associated to the client.
  needOccurrences: {type: [GDBNeedOccurrenceModel], internalKey: ':hasNeedOccurrence', onDelete: DeleteType.CASCADE},
  note: {type: [String], internalKey: ':hasNote'},
  firstName: {type: String, internalKey: 'foaf:givenName'},
  lastName: {type: String, internalKey: 'foaf:familyName'},
  gender: {type: Types.NamedIndividual, internalKey: 'cp:hasGender'},
}, {
  rdfTypes: [':Client'], name: 'client'
});
```


### Waitlists For Service Occurrences
```js
const GDBServiceWaitlistModel = createGraphDBModel({
  waitlist: {type: [GDBServiceWaitlistEntryModel], internalKey: ':hasWaitlist'},
  serviceOccurrence: {type: GDBServiceOccurrenceModel, internalKey: ':hasServiceOccurrence'},
},
{  
  rdfTypes: [':ServiceWaitlist'], name: 'serviceWaitlist'
});
```

### Waitlists for Program Occurrences
```js
const GDBProgramWaitlistModel = createGraphDBModel({
  waitlist: {type: [GDBProgramWaitlistEntryModel], internalKey: ':hasWaitlist'},
  programOccurrence: {type: GDBProgramOccurrenceModel, internalKey: ':hasProgramOccurrence'},
},
{  
  rdfTypes: [':ProgramWaitlist'], name: 'programWaitlist'
});
```

### Entry object for Service Waitlists
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




### Entry object for Program Waitlists
```js
const GDBProgramWaitlistEntryModel = createGraphDBModel({
  programRegistration: {type: GDBProgramRegistrationModel, internalKey: ':hasProgramRegistration'},
  priority: {type: Number, internalKey: ':hasPriority'},
  date: {type: Date, internalKey: ':hasDate'},
},
{  
  rdfTypes: [':ProgramWaitlistEntry'], name: 'programWaitlistEntry'
});
```




