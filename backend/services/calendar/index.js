const {GDBAppointmentModel} = require("../../models/appointment");
const {GDBServiceProviderModel} = require("../../models");
const {extractAllIndexes} = require("../../helpers/stringProcess");
const {graphdb} = require("../../config");

async function fetchAppointment(req, res, next) {

  const fts_appointments = await fts_appointment_for_calendar(req.body);
  if (fts_appointments.length === 0) {
    return res.status(200).json({data: [], success: true});
  }

  let array = [...new Set([...fts_appointments])];

  if (array.length !== 0) {
    let data_array = [];
    for (let i = 0; i < array.length; i++) {
      data_array.push(await GDBAppointmentModel.find({_uri: array[i]},
        {populates: ['characteristicOccurrences.occurrenceOf', 'questionOccurrence', 'address']}));
    }
    data = data_array.flat();
  }

  return res.status(200).json({data, success: true});
}

async function fts_appointment_for_calendar(params) {
  // Assume all passed in date are in the format of "2024-02-22T00:00:00Z"
  const {user_id, startDate, endDate} = params;

  let date_query;
  if (!startDate || !endDate) {
    date_query = ``;
  } else {
    date_query = `FILTER (?date >= xsd:dateTime("${startDate}") && ?date < xsd:dateTime("${endDate}")).`;
  }

  // The id of the user should be an integer like 1, 2, 3, etc.
  let person_query;
  if (!user_id) {
    person_query = ``;
  } else {
    person_query = `?object1 snmi:hasPerson snmi:person_${user_id}.`;
  }

  const sparqlQuery =
    `
PREFIX  xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX  snmi: <http://snmi#>
PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT  ?object1
WHERE
  { ?object1  rdf:type  snmi:Appointment
    { ?object1  snmi:hasCharacteristicOccurrence  ?date_object .
      ?date_object  snmi:occurrenceOf  ?characteristicOccurrence_object ;
                snmi:hasDateValue     ?date
        ${date_query}
        ${person_query}
    }
  }
      `;

  console.log("Query: ", sparqlQuery);

  let query = graphdb.addr + "/repositories/snmi?query="  + encodeURIComponent(sparqlQuery);

  const response = await fetch(query);
  const text = await response.text();
  return extractAllIndexes(text);

}


module.exports = {fetchAppointment};
