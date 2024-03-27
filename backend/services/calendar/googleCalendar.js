const {google} = require('googleapis');
const {updateGoogleRefreshToken} = require("../userAccount/users");
const {findUserAccountById} = require("../userAccount/user");

require('dotenv').config();
GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);


async function fetchGoogleAppointments(req, res, next) {
  const { codeResponse, userId } = req.body;
  const currentUser = await findUserAccountById(userId); // This is a function from userAccount/user.js that finds a user by ID
  // Check if currentUser have googleRefreshToken
  if (currentUser.googleRefreshToken) {
    oAuth2Client.setCredentials({refresh_token: currentUser.googleRefreshToken});
  }
  else {
    const code = req.body.code;
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials({refresh_token: tokens.refresh_token});
    const email = currentUser.primaryEmail;
    await updateGoogleRefreshToken(email, tokens.refresh_token);
  }

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

  return res.status(200).json({success: true, data});


}



module.exports = {fetchGoogleAppointments};