const GDBAppointmentModel = require('../../models/appointment');
const { GDBClientModel } = require('../../models/ClientFunctionalities/client');
const { GDBUserModel } = require('../../models/UserFunctionalities/user');
const { GDBPersonModel } = require('../../models/PersonFunctionalities/person');


// Check for conflicts for existing appointments, return true if there is a conflict
const checkAppointmentConflict = async (newAppointment) => {

    // For now, appointment can only have one client
    const client = newAppointment.client;
    // Appointment can have multiple users, persons
    const person = newAppointment.person;
    // User can have calendar events
    const user = newAppointment.user;
    const startTime = newAppointment.datetime;
    const endTime = newAppointment.until;

    const query_givenAppointmentConflict = `
        PREFIX : <http://snmi#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT ?appointment
        WHERE {
            {
                ?appointment :forClient <${client}> ;
                             :hasDatetime ?start ;
                             :hasUntil ?end .
                FILTER (?start <= "${endTime}"^^xsd:dateTime && ?end >= "${startTime}"^^xsd:dateTime)
            }
            UNION
            {
                ?appointment :hasPerson <${person}> ;
                             :hasDatetime ?start ;
                             :hasUntil ?end .
                FILTER (?start <= "${endTime}"^^xsd:dateTime && ?end >= "${startTime}"^^xsd:dateTime)
            }
            UNION
            {
                ?appointment :withUser <${user}> ;
                             :hasDatetime ?start ;
                             :hasUntil ?end .
                FILTER (?start <= "${endTime}"^^xsd:dateTime && ?end >= "${startTime}"^^xsd:dateTime)
            }
        }
    `;

    const query_allAppointmentConflict = `
        PREFIX : <http://snmi#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ic: <http://ontology.eil.utoronto.ca/tove/icontact#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT ?appointment1 ?appointment2 
            (CONCAT(?clientGivenName, " ", ?clientFamilyName) AS ?client) 
            (CONCAT(?personGivenName, " ", ?personFamilyName) AS ?person) 
            ?user
        WHERE {
            {
                ?appointment1 :forClient ?clientURI ;
                            :hasDatetime ?start1 ;
                            :hasUntil ?end1 .
                ?appointment2 :forClient ?clientURI ;
                            :hasDatetime ?start2 ;
                            :hasUntil ?end2 .
                ?clientURI foaf:familyName ?clientFamilyName ;
                        foaf:givenName ?clientGivenName .
                
                FILTER (?appointment1 != ?appointment2 && str(?appointment1) < str(?appointment2) && ?start1 <= ?end2 && ?end1 >= ?start2)
            }
            UNION
            {
                ?appointment1 :hasPerson ?personURI ;
                            :hasDatetime ?start1 ;
                            :hasUntil ?end1 .
                ?appointment2 :hasPerson ?personURI ;
                            :hasDatetime ?start2 ;
                            :hasUntil ?end2 .
                ?personURI foaf:familyName ?personFamilyName ;
                        foaf:givenName ?personGivenName .
                FILTER (?appointment1 != ?appointment2 && str(?appointment1) < str(?appointment2) && ?start1 <= ?end2 && ?end1 >= ?start2)
            }
            UNION
            {
                ?appointment1 :withUser ?userURI ;
                            :hasDatetime ?start1 ;
                            :hasUntil ?end1 .
                ?appointment2 :withUser ?userURI ;
                            :hasDatetime ?start2 ;
                            :hasUntil ?end2 .
                ?userURI :hasDisplayName ?user .
                FILTER (?appointment1 != ?appointment2 && str(?appointment1) < str(?appointment2) && ?start1 <= ?end2 && ?end1 >= ?start2)
            }
            FILTER (BOUND(?start1) && BOUND(?end1) && BOUND(?start2) && BOUND(?end2))
        }

    `;

    const existingAppointments = await GDBAppointmentModel.executeSparqlQuery(query_givenAppointmentConflict, {
        client: client,
        person: person,
        user: user,
        startTime: startTime,
        endTime: endTime
    });

    if (existingAppointments.length > 0) {

        //Conflict(s) found
        const conflictAppointments = await GDBAppointmentModel.executeSparqlQuery(query_allAppointmentConflict);

        console.log(JSON.stringify(conflictAppointments, null, 2));
        
        return conflictAppointments.map(appointment => ({
            appointment1: appointment.appointment1.value,
            appointment2: appointment.appointment2.value,
            client: appointment.client.value,
            person: appointment.person.value,
            user: appointment.user.value
        }));
    } else {
        // No conflict found
        return false
    }

};
