const {google} = require('googleapis');

const GOOGLE_CLIENT_ID = "97097151571-4mfu6di9l4qg6baibofrr3d3e46fh354.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

const REFRESH_TOKEN = "1//05CcNfRSpgQTeCgYIARAAGAUSNwF-L9IruHXRmA0c3_-13jz8hAhAwKBmyDS5c-p8Yi-Sig4aJFURU0U03ed6nVDHhTfiuX8HMbo";

async function fetchGoogleAppointments(req, res, next) {
  const code = req.body.code;

  oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items;
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });

}



module.exports = {fetchGoogleAppointments};