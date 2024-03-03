const {GDBAppointmentModel} = require("../../models/appointment");
const {GDBServiceProviderModel} = require("../../models");
const {extractAllIndexes} = require("../../helpers/stringProcess");
const {graphdb} = require("../../config");
const {GDBCharacteristicModel} = require("../../models/ClientFunctionalities/characteristic");
const {GDBCOModel} = require("../../models/ClientFunctionalities/characteristicOccurrence");

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
        {populates: ['characteristicOccurrences.occurrenceOf']}));

      // Obtain the values from the characteristicOccurrences
      // Iterate through the characteristicOccurrences
      // for (let j = 0; j < data_array[i][0].characteristicOccurrences.length; j++) {
      //   let occurrence = data_array[i][0].characteristicOccurrences[j];
      //   if (occurrence.occurrenceOf) {
      //     // Check if the occurrence is the start date of the appointment
      //     if (occurrence.occurrenceOf.description === "Start date of a service Occurrence") {
      //       // Get the date
      //       data_array[i][0].set("start", occurrence.dataDateValue);
      //       // data_array[i][0].set("end", new Date());
      //     }
      //     if (occurrence.occurrenceOf.description === "End date of a service Occurrence") {
      //       // Get the date
      //       data_array[i][0].set("end", occurrence.dataDateValue);
      //     }
      //     // Obtain the title of the appointment
      //     if (occurrence.occurrenceOf.description === "Appointment Name") {
      //       data_array[i][0].set("title", occurrence.dataStringValue);
      //     }
      //   }
      // }
    }
    data = data_array.flat();
  }

  return res.status(200).json({data, success: true});
}

async function fts_appointment_for_calendar(params) {
  // Assume all passed in date are in the format of "2024-02-22T00:00:00Z"
  const {user_id, startDate, endDate} = params;

  // let date_query;
  // if (!startDate || !endDate) {
  //   date_query = ``;
  // } else {
  //   date_query = `FILTER (?date >= xsd:dateTime("${startDate}") && ?date < xsd:dateTime("${endDate}")).`;
  // }

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
    { 
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
