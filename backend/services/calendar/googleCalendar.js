const {google} = require('googleapis');

const GOOGLE_CLIENT_ID = "97097151571-4mfu6di9l4qg6baibofrr3d3e46fh354.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);


async function fetchGoogleAppointments(req, res, next) {
  const code = req.body.code;

  const {tokens} = await oAuth2Client.getToken(code);

  oAuth2Client.setCredentials({refresh_token: tokens.refresh_token});

  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
  const response = await calendar.events.list({
    calendarId: 'primary',
    maxResults: 2500,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items;

  const data = []
  events.map((event, i) => {
    const start = Date.parse(event.start.dateTime || event.start.date);
    const end = Date.parse(event.end.dateTime || event.end.date);
    data.push({startDate: start, endDate: end, appointmentName: event.summary});
  });

  // console.log("Data: ", data);
  return res.status(200).json({success: true, data});


}



module.exports = {fetchGoogleAppointments};