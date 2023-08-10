---
title: Business and functional requirements
---

## Business requirements
Key business requirements for a social services decision support system include
functionality that ensures or enhances service providers' ability to:
- intake and manage clients
  - collect and manage client information
  - assess client problems, goals and needs
  - connect clients with services
  - track client progress (via milestones and outcomes)
- set-up and manage programs and services
  - assess program/service outcomes
  - identify program/services trends, bottlenecks, etc.
  - improve service delivery
    - assess operational efficiency
- onboard and manage staff
  - collect and manage staff information
  - assess staff performance
- onboard and manage volunteers
  - collect and manage volunteer information
  - assess volunteer performance
- make informed day-to-day or strategic decisions
- report to funders and other key stakeholders
- support the development of compelling funding proposals
- intake and manage donors

## Functional requirements
Key functional requirements for a social services decision support system
include:
- Case management: ability to manage information about an individual client
  file including contact information, goals, needs, services accessed and
  outcomes, manage and track referrals for individual clients as they move
  through an agency's programs.
- Program/Service management: ability to monitor and manage programs within an
  agency (access to 'live' information about workload, client volume, costs and
  budgets).
- Assessment management: ability to produce up-to-date reports on client and
  program progress towards pre-defined outcomes, staff and volunteer
  performance and service efficiency.
- Reporting: ability to access standard reports and to build own
  queries/reports using an intuitive interface.
- Funder reporting: ability to submit reports to funders via email or web
  services.
- Granular security/access management: ability to control the access to
  information available to staff, volunteers, external consultants, etc.
- Customization: ability to add new fields/connections and interface
  templates/forms in a manner that does not interfere with the core operation
  of the system.

### User-related functionality
- Register with the application (upon receiving an invitation from an admin)
- Log into their account
- Reset their password
- Change their password at any time (requires log-in)
- Edit their profile information at any time (requires log-in)

### Admin functionality
- Account creation and management
  - Create an account for an employee of the organization (and send an
    invitation for the person to complete the registration)
    - Required information: person's first and last name, email, and role in
      the organization
  - Activate account
  - Automatic account deactivation
  - Manual account deactivation
  - Browse account / user profiles
  - Search accounts (e.g., based on account name and user information)
- Authorization (access control) management
  - Create and manage attributes (data attributes, user attributes, including roles, etc.)
  - Create and manage functionality/resource access policies
- Form-item (i.e. characteristics, questions, notes, etc.) management
  - Create new characteristic / question for clients, services, referrals, etc.
    - Required information: name and description of the item (i.e., characteristic, question, etc.), and item implementation information
  - Create new generic goals
  - Create new generic needs
  - Create new generic need satisfiers
  - Create new generic services
  - Create new generic outcomes
    - Required information: description and implementation information
- Form management
  - Create new form by specifying what form items (e.g., characteristics,
    questions, etc) to be included and whether they are mandatory or not.
    - client
    - assessment
    - service
    - appointment
    - referral
    - service registration
    - goods
- Application log management
  - Browse log
  - Manage log (change location, max size, overwriting rules, etc.
  - Delete log
  - Generate audit reports to support regulatory compliance with HIPAA, GDPR,
    PCI DSS, etc.

### Client management functionality
Sample of relevant competency questions:
- Is Jason in the […] system?
- What are Jason's current goals and things he is working on?
- How can I edit or change this information later if needed?
- How can I add a personal note to the file on Jason's behalf?
- What needs are clients presenting to staff?
- Which programs and services has Jason previously connected with?
- Which programs and services is Jason currently connected with?

The system shall allow the user to:
- Create a new client using one of the forms available in the system
  - Required information: the information corresponding to the items in the
    (client intake) form selected, e.g., client name, date of birth, email,
    etc.
- Browse existing clients (and sort results based on selected characteristics)
- Visualize the profile of a selected client
- Edit the profile of a selected client
- Add / edit / delete client goals
- Add / edit / delete client needs
- Create an appointment (with an application user) for a selected client
- Create / edit / delete assessments for a selected client
- Create an internal/external referral for a client
- Search existing clients (based on selected characteristics)
- Register client for service

### Matching management
Sample of relevant competency questions:
- What services are available for affordable housing?
- Which services match my mental health needs?

The system shall allow the user to:
- Manual match: browse existing services and match/link to client needs
- Semi-automatic service-need match via recommendations provided by the system

### Service provider management functionality
Sample of relevant competency questions:
- What service providers offer LINC language assessments?
- What is the location of the providers that manage safe consumption sites in
  Vancouver?

The system shall allow the user to:
- Create a new service provider (volunteer, external organization, independent
  professional) using one of the forms available in the system
  - Required information: the information corresponding to the items in the
    form selected, e.g., organization name, description, primary contact
    information (first and last name, phone, email), mission, values, etc.
- Browse existing providers (and sort results based on selected characteristics)
- Visualize the profile of a selected provider
- Edit / delete the profile of a selected provider
- Search existing providers (based on selected characteristics)

### Program/service management functionality
- Create a new program/service using one of the service management forms
  available in the system
  - Required information: the information corresponding to the characteristics
    in the form selected, e.g., service name, description, primary contact
    information (first and last name, phone, email), description, eligibility
    condition, service provider
- Browse existing programs/services (and sort results based on selected
  characteristics)
- Visualize the profile of a selected program/service
- Edit the profile of a selected program/service
- Create an intake form for a selected service/program
- Search for a program/service (based on selected characteristics), including
  services from partner organizations.

### (Internal) Appointment management functionality
- Create a new appointment using one of the forms available in the system
  - Required information: e.g., client, user (account), service requested,
    notes, etc.
- Browse appointments
- Visualize the content of a selected appointment
- Edit the content of a selected appointment
- (Advanced) Search existing appointment (based on selected characteristics)
- Send appointment reminders to client / user

### Referral management functionality
- Create a new referral using one of the referral forms available in the system
  - Required information: e.g., client, organization referred to,
    service/program referred to, etc.
- Browse incoming/outgoing referrals
- Visualize the content of a selected referral
- Edit the content of a selected in-coming referral
- (Advanced) Search existing incoming/outgoing referrals (based on selected
  characteristics)

### Assessment management functionality
- Create a new assessment using one of the assessment forms available in the
  system
  - Required information: e.g., client, organization referred to,
    service/program referred to, etc.
- Browse assessments
- Visualize the content of a selected assessment
- Edit the content of a selected assessment
- (Advanced) Search existing assessment (based on selected characteristics)

### Reporting functionality
- Create a new report using one of the  forms available in the system
- Browse existing reports
