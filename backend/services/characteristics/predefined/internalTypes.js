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
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },
  {
    name: 'serviceProviderForService',
    predefinedProperty: 'http://snmi#hasServiceProvider',
    formType: 'service',
    implementation: {
      label: 'Service Provider',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceProvider'
    }
  },
  {
    name: 'programForService',
    predefinedProperty: 'http://snmi#hasProgram',
    formType: 'service',
    implementation: {
      label: 'Program',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Program'
    }
  },
  {
    name: 'partnerOrganizationForService',
    predefinedProperty: 'http://snmi#hasPartnerOrganization',
    formType: 'service',
    implementation: {
      label: 'Partner Organization',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Organization'
    }
  },

  // below are for program occurrence
  {
    name: 'programForProgramOccurrence',
    predefinedProperty: 'http://snmi#occurrenceOf',
    formType: 'programOccurrence',
    implementation: {
      label: 'Program',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Program'
    }
  },
  {
    name: 'needSatisfierForProgramOccurrence',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'programOccurrence',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },

  // below are for program
  {
    name: 'needSatisfierForProgram',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'program',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },
  {
    name: 'serviceProviderForProgram',
    predefinedProperty: 'http://snmi#hasServiceProvider',
    formType: 'program',
    implementation: {
      label: 'Service Provider',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceProvider'
    }
  },
  {
    name: 'managerForProgram',
    predefinedProperty: 'http://snmi#hasManager',
    formType: 'program',
    implementation: {
      label: 'Program Manager',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://ontology.eil.utoronto.ca/cids/cids#Person'
    }
  },
  {
    name: 'partnerOrganizationForProgram',
    predefinedProperty: 'http://snmi#hasPartnerOrganization',
    formType: 'program',
    implementation: {
      label: 'Partner Organization',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Organization'
    }
  },

  // below are for service Provision
  {
    name: 'needOccurrenceForServiceProvision',
    predefinedProperty: 'http://snmi#forNeedOccurrence',
    formType: 'serviceProvision',
    implementation: {
      label: 'Need Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedOccurrence'
    }
  },
  {
    name: 'needSatisfierForServiceProvision',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'serviceProvision',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },
  {
    name: 'needSatisfierOccurrenceForServiceProvision',
    predefinedProperty: 'http://snmi#hasNeedSatisfierOccurrence',
    formType: 'serviceProvision',
    implementation: {
      label: 'Need Satisfier Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfierOccurrence'
    }
  },
  {
    name: 'serviceForServiceProvision',
    predefinedProperty: 'http://snmi#hasService',
    formType: 'serviceProvision',
    implementation: {
      label: 'Service',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Service'
    }
  },
  {
    name: 'serviceOccurrenceForServiceProvision',
    predefinedProperty: 'http://snmi#hasServiceOccurrence',
    formType: 'serviceProvision',
    implementation: {
      label: 'Service Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceOccurrence'
    }
  },
  {
    name: 'clientForServiceProvision',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'serviceProvision',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
    }
  },



  // below are for service waitlist
  {
    name: 'waitlistForServiceWaitlist',
    predefinedProperty: 'http://snmi#hasWaitlist',
    formType: 'serviceWaitlist',
    implementation: {
      label: 'Waitlist',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#WaitlistEntry'
    }
  },
  {
    name: 'serviceOccurrenceForServiceWaitlist',
    predefinedProperty: 'http://snmi#hasServiceOccurrence',
    formType: 'serviceWaitlist',
    implementation: {
      label: 'ServiceOccurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceOccurrence'
    }
  },

  //below are for waitlist Entry
  {
    name: 'serviceRegistrationForWaitlistEntry',
    predefinedProperty: 'http://snmi#hasServiceRegistration',
    formType: 'waitlistEntry',
    implementation: {
      label: 'ServiceRegistration',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ServiceRegistration'
    }
  },



  // below are for service waitlist
  {
    name: 'waitlistForProgramWaitlist',
    predefinedProperty: 'http://snmi#hasWaitlist',
    formType: 'programWaitlist',
    implementation: {
      label: 'Waitlist',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#ProgramWaitlistEntry'
    }
  },
  {
    name: 'programOccurrenceForProgramWaitlist',
    predefinedProperty: 'http://snmi#hasProgramOccurrence',
    formType: 'programWaitlist',
    implementation: {
      label: 'ProgramOccurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ProramOccurrence'
    }
  },

  //below are for programWaitlistEntry
  {
    name: 'programRegistrationForProgramWaitlistEntry',
    predefinedProperty: 'http://snmi#hasProgramRegistration',
    formType: 'programWaitlistEntry',
    implementation: {
      label: 'ProgramRegistration',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ProgramRegistration'
    }
  },




  // below are for program Provision
  {
    name: 'needOccurrenceForProgramProvision',
    predefinedProperty: 'http://snmi#forNeedOccurrence',
    formType: 'programProvision',
    implementation: {
      label: 'Need Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedOccurrence'
    }
  },
  {
    name: 'needSatisfierForProgramProvision',
    predefinedProperty: 'http://snmi#hasNeedSatisfier',
    formType: 'programProvision',
    implementation: {
      label: 'Need Satisfier',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfier'
    }
  },
  {
    name: 'needSatisfierOccurrenceForProgramProvision',
    predefinedProperty: 'http://snmi#hasNeedSatisfierOccurrence',
    formType: 'programProvision',
    implementation: {
      label: 'Need Satisfier Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedSatisfierOccurrence'
    }
  },
  {
    name: 'programForProgramProvision',
    predefinedProperty: 'http://snmi#hasProgram',
    formType: 'programProvision',
    implementation: {
      label: 'Program',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Program'
    }
  },
  {
    name: 'programOccurrenceForProgramProvision',
    predefinedProperty: 'http://snmi#hasProgramOccurrence',
    formType: 'programProvision',
    implementation: {
      label: 'Program Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ProgramOccurrence'
    }
  },
  {
    name: 'clientForProgramProvision',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'programProvision',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
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
  {
    name: 'referralForAppointment',
    predefinedProperty: 'http://snmi#hasReferral',
    formType: 'appointment',
    implementation: {
      label: 'Referral',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Referral'
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
    name: 'programForReferral',
    predefinedProperty: 'http://snmi#forProgram',
    formType: 'referral',
    implementation: {
      label: 'Program',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Program'
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
  {
    name: 'programOccurrenceForReferral',
    predefinedProperty: 'http://snmi#hasProgramOccurrence',
    formType: 'referral',
    implementation: {
      label: 'Program Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ProgramOccurrence'
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
    name: 'needOccurrenceForServiceRegistration',
    predefinedProperty: 'http://snmi#forNeedOccurrence',
    formType: 'serviceRegistration',
    implementation: {
      label: 'Need Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedOccurrence'
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

  // below are for program registration
  {
    name: 'programOccurrenceForProgramRegistration',
    predefinedProperty: 'http://snmi#hasProgramOccurrence',
    formType: 'programRegistration',
    implementation: {
      label: 'Program Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#ProgramOccurrence'
    }
  },
  {
    name: 'clientForProgramRegistration',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'programRegistration',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
    }
  },
  {
    name: 'referralForProgramRegistration',
    predefinedProperty: 'http://snmi#hasReferral',
    formType: 'programRegistration',
    implementation: {
      label: 'Referral',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Referral'
    }
  },
  {
    name: 'appointmentForProgramRegistration',
    predefinedProperty: 'http://snmi#hasAppointment',
    formType: 'programRegistration',
    implementation: {
      label: 'Appointment',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Appointment'
    }
  },
  {
    name: 'needOccurrenceForProgramRegistration',
    predefinedProperty: 'http://snmi#forNeedOccurrence',
    formType: 'programRegistration',
    implementation: {
      label: 'Need Occurrence',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#NeedOccurrence'
    }
  },

  // Need Occurrence
  {
    name: 'needForNeedOccurrence',
    predefinedProperty: 'http://snmi#occurrenceOf',
    formType: 'needOccurrence',
    implementation: {
      label: 'Need (occurrenceOf)',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Need'
    }
  },

  // Outcome Occurrence
  {
    name: 'outcomeForOutcomeOccurrence',
    predefinedProperty: 'http://snmi#occurrenceOf',
    formType: 'outcomeOccurrence',
    implementation: {
      label: 'Outcome (occurrenceOf)',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Outcome'
    }
  },
  {
    name: 'clientForOutcomeOccurrence',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'outcomeOccurrence',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
    }
  },

  // Client
  {
    name: 'needForClient',
    predefinedProperty: 'http://snmi#hasNeed',
    formType: 'client',
    implementation: {
      label: 'Need',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Need'
      }
  },
  {
    name: 'outcomeForClient',
    predefinedProperty: 'http://snmi#hasOutcome',
    formType: 'client',
    implementation: {
      label: 'Outcome',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Outcome'
      }
  },

  // Client Assessment
  {
    name: 'clientForClientAssessment',
    predefinedProperty: 'http://snmi#hasClient',
    formType: 'clientAssessment',
    implementation: {
      label: 'Client',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Client'
      }
  },
  {
    name: 'userAccountForClientAssessment',
    predefinedProperty: 'http://snmi#withUser',
    formType: 'clientAssessment',
    implementation: {
      label: 'User',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#UserAccount'
    }
  },
  {
    name: 'personForClientAssessment',
    predefinedProperty: 'http://snmi#hasPerson',
    formType: 'clientAssessment',
    implementation: {
      label: 'Person',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://ontology.eil.utoronto.ca/cids/cids#Person'
    }
  },
  {
    name: 'outcomeForClientAssessment',
    predefinedProperty: 'http://snmi#hasOutcome',
    formType: 'clientAssessment',
    implementation: {
      label: 'Outcome',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Outcome'
    }
  },
  {
    name: 'needForClientAssessment',
    predefinedProperty: 'http://snmi#hasNeed',
    formType: 'clientAssessment',
    implementation: {
      label: 'Need',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Need'
    }
  },
  {
    name: 'questionForClientAssessment',
    predefinedProperty: 'http://snmi#hasQuestion',
    formType: 'clientAssessment',
    implementation: {
      label: 'Question',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Question'
    }
  },

  // Volunteer
  {
    name: 'organizationForVolunteer',
    predefinedProperty: 'http://snmi#hasOrganization',
    formType: 'volunteer',
    implementation: {
      label: 'Organization',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.SingleSelectField,
      optionsFromClass: 'http://snmi#Organization'
    }
  },
  {
    name: 'partnerOrganizationForVolunteer',
    predefinedProperty: 'http://snmi#hasPartnerOrganization',
    formType: 'volunteer',
    implementation: {
      label: 'Partner Organization',
      valueDataType: 'owl:NamedIndividual',
      fieldType: FieldTypes.MultiSelectField,
      optionsFromClass: 'http://snmi#Organization'
    }
  },

]
