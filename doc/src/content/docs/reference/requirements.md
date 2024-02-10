---
title: Business and functional requirements
---

## **Business Requirements**
Provide or improve service providers' ability to:
- intake and manage clients:
  - collect and manage client information
  - assess client problems, goals and needs
  - connect clients with services
  - track client progress (via milestones and outcomes)
- setup and manage programs and services:
  - assess program/service outcomes
  - identify program/services trends, bottlenecks, etc.
  - improve service delivery
    - assess operational efficiency
- onboard and manage staff:
  - collect and manage staff information
  - assess staff performance
- onboard and manage volunteers:
  - collect and manage volunteer information
  - assess volunteer performance
- make informed day-to-day or strategic decisions
- report to funders and other key stakeholders
- support the development of compelling funding proposals
- intake and manage donors

## **Functional Requirements**
- Case management: ability to manage information about individual client
  files. Includes contact information, goals, needs, services accessed and
  outcomes, and manage and track referrals for individual clients as they move
  through an agency's programs.
- Program/Service management: ability to monitor and manage programs within an
  agency (access to 'live' information about workload, client volume, costs and
  budgets).
- Assessment management: ability to produce up-to-date reports on client and
  program progress towards pre-defined outcomes, staff and volunteer
  performance, and service efficiency.
- Reporting: ability to access standard reports and build new
  queries/reports using an intuitive interface.
- Funder reporting: ability to submit reports to funders via email or web
  services.
- Granular security/access management: ability to control the access to
  information available to staff, volunteers, external consultants, etc.
- Customization: ability to add new fields/connections and interface
  templates/forms without interfering with the core operation of the system.

### **User**
- Register with the application through an invitation from an admin ([API](/guides/api/#register))
- Log in and out ([API](/guides/api/#base))
- Reset password ([API](/guides/api/#forgotpassword))
- Change password ([API](/guides/api/#user))
- Edit profile information ([API](/guides/api/#user))

### **Admin**
- Account creation and management
  - Create accounts for employees of the organization (and send invitations for
    them to complete the registration)
    ([API](/guides/api/#register))
    - Required information: employee's first and last name, email, and role in
      the organization
    - Activate account after registration ([API](/guides/api/#register))
  - Automatically deactivate accounts
  - Manually deactivate accounts ([API](/guides/api/#user))
  - Search for specific accounts based on user information
    ([API](/guides/api/#user))
  - Browse all user profiles ([API](/guides/api/#users))
- Authorization (access control) management
  - Create and manage attributes (eg. data, user, roles)
  - Create and manage functionality/resource access policies
- Form-item (e.g. characteristics, questions, notes) management
  - Create characteristics/questions for clients, services, referrals, etc.
    ([API 1](/guides/api/#characteristic); [API 2](/guides/api/#question))
    - Required information: name and description of the item (e.g.
      characteristic, question), and item implementation information:
  - Create generic goals
  - Create generic needs ([API](/guides/api/#need))
  - Create generic need satisfiers ([API](/guides/api/#needsatisfier))
  - Create generic services ([API](/guides/api/#serviceproviders))
  - Create generic outcomes ([API](/guides/api/#outcome))
    - Required information: description and implementation information
- Form management ([API](/guides/api/#dynamicform))
  - Create forms by specifying what form items (e.g. characteristics,
    questions) to be included and whether they are mandatory:
    - client
    - assessment
    - service
    - appointment
    - referral
    - service registration
    - goods
- Application log management:
  - Browse log
  - Manage log (eg. change location, max size, overwriting rules)
  - Delete log
  - Generate audit reports to support regulatory compliance with HIPAA, GDPR,
    PCI DSS, etc.

### **Client management**
- Create clients using one of the forms available in the system
  - Required information: the information corresponding to the items in the
    (client intake) form selected (e.g. client name, date of birth, email)
- Browse existing clients (and sort results based on selected characteristics)
- Visualize the profile of a selected client
- Edit the profile of a selected client
- Add/edit/delete client goals
- Add/edit/delete client needs
- Create appointments (with an application user) for a selected client
- Create/edit/delete assessments for a selected client
- Create internal/external referrals for a client
- Search existing clients (based on selected characteristics)
- Register client for service

#### **Sample questions**
- Is Jason in the [...] system?
- What are Jason's current goals and things he is working on?
- How can I edit or change this information later if needed?
- How can I add a personal note to the file on Jason's behalf?
- What needs are clients presenting to staff?
- Which programs and services has Jason previously connected with?
- Which programs and services is Jason currently connected with?

### **Matching management**
- Manual match: browse existing services and match/link to client needs
- Semi-automatic service-need match via recommendations provided by the system

#### **Sample questions**
- What services are available for affordable housing?
- Which services match my mental health needs?

### **Service provider management**
([API](/guides/api/#serviceproviders))
- Create service providers (volunteer, external organization, independent
  professional) using one of the forms available in the system
  - Required information: the information corresponding to the items in the
    form selected (e.g. organization name, description, primary contact
    information, mission, values)
- Browse existing providers (and sort results based on selected characteristics)
- Visualize the profile of a selected provider
- Edit/delete the profile of a selected provider
- Search existing providers based on selected characteristics

#### **Sample questions**
- What service providers offer LINC language assessments?
- What is the location of the providers that manage safe consumption sites in
  Vancouver?

### **Program/service management**
- Create new programs/services using one of the service management forms
  available in the system
  - Required information: the information corresponding to the characteristics
    in the form selected, e.g. service name, description, primary contact
    information, description, eligibility condition, service provider
- Browse existing programs/services (and sort results based on selected
  characteristics)
- Visualize the profile of a selected program/service
- Edit/delete the profile of a selected program/service
- Create intake forms for a selected service/program
- Search for programs/services based on selected characteristics, including
  services from partner organizations

### **[Internal] Appointment management**
- Create appointments using one of the forms available in the system
  - Required information: e.g. client, user, service requested, notes
- Browse appointments
- Visualize the content of a selected appointment
- Edit the content of a selected appointment
- [Advanced] Search existing appointments based on selected characteristics
- Send appointment reminders to a client/user

### **Referral management**
- Create referrals using one of the referral forms available in the system
  - Required information: e.g. client, organization, service/program
- Browse incoming/outgoing referrals
- Visualize the content of a selected referral
- Edit the content of a selected in-coming referral
- [Advanced] Search existing incoming/outgoing referrals based on selected
  characteristics

### **Assessment management**
- Create assessments using one of the assessment forms available in the system
  - Required information: e.g. client, organization, service/program
- Browse assessments
- Visualize the content of a selected assessment
- Edit the content of a selected assessment
- [Advanced] Search existing assessment (based on selected characteristics)

### **Reporting**
- Create reports using one of the forms available in the system
- Browse existing reports
