const {FieldTypes} = require("../misc");
module.exports = [
  // below are for service occurrence
  {
    name: 'serviceForServiceOccurrence',
    predefinedProperty: 'http://snmi#occurrenceOf',
    formType: 'serviceOccurrence',
    implementation: {
      label: 'Service',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Service'
    }
  },
  {
    name: 'needSatisfierForServiceOccurrence',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'serviceOccurrence',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },
  // below are for service
  {
    name: 'needSatisfierForService',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'service',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },
  // below are for appointment
  {
    name: 'clientForAppointment',
    predefinedProperty: 'http://snmi#forClient',
    formType: 'appointment',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
    }
  },
  {
    name: 'userAccountForAppointment',
    predefinedProperty: 'http://snmi#withUser',
    formType: 'appointment',
    implementation: {
      label: 'User Account',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#UserAccount'
    }
  },
  {
    name: 'personForAppointment',
    predefinedProperty: 'http://snmi#hasPerson',
    formType: 'appointment',
    implementation: {
      label: 'Person',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://ontology.eil.utoronto.ca/cids/cids#Person'
    }
  },
  // below are for referral
  {
    name: 'clientForReferral',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'referral',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
    }
  },
  {
    name: 'referringServiceProviderForReferral',
    predefinedProperty: 'http://snmi#hasReferringServiceProvider',
    formType: 'referral',
    implementation: {
      label: 'Referring Service Provider',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceProvider'
    }
  },
  {
    name: 'receivingServiceProviderForReferral',
    predefinedProperty: 'http://snmi#hasReceivingServiceProvider',
    formType: 'referral',
    implementation: {
      label: 'Receiving Service Provider',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceProvider'
    }
  },
  {
    name: 'needOccurrenceForReferral',
    predefinedProperty: 'http://snmi#hasNeedOccurrence',
    formType: 'referral',
    implementation: {
      label: 'Need Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedOccurrence'
    }
  },
  {
    name: 'serviceForReferral',
    predefinedProperty: 'http://snmi#forService',
    formType: 'referral',
    implementation: {
      label: 'Service',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Service'
    }
  },
  {
    name: 'serviceOccurrenceForReferral',
    predefinedProperty: 'http://snmi#hasServiceOccurrence',
    formType: 'referral',
    implementation: {
      label: 'Service Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceOccurrence'
    }
  },

  // below are for service registration
  {
    name: 'serviceOccurrenceForServiceRegistration',
    predefinedProperty: 'http://snmi#hasServiceOccurrence',
    formType: 'serviceRegistration',
    implementation: {
      label: 'Service Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceOccurrence'
    }
  },
  {
    name: 'clientForServiceRegistration',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'serviceRegistration',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
    }
  },
  {
    name: 'referralForServiceRegistration',
    predefinedProperty: 'http://snmi#hasReferral',
    formType: 'serviceRegistration',
    implementation: {
      label: 'Referral',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Referral'
    }
  },
  {
    name: 'appointmentForServiceRegistration',
    predefinedProperty: 'http://snmi#hasAppointment',
    formType: 'serviceRegistration',
    implementation: {
      label: 'Appointment',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Appointment'
    }
  },

]