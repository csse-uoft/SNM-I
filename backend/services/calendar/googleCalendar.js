const {google} = require('googleapis');
const {updateUserAccount} = require("../userAccount/user");
const {findUserAccountById} = require("../userAccount/user");

require('dotenv').config();
GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

async function updateGoogleLogin(req, res, next){
  const { codeResponse, userId } = req.body;
  const currentUser = await findUserAccountById(userId); // This is a function from userAccount/user.js that finds a user by ID

  const code = req.body.code;
  const {tokens} = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials({refresh_token: tokens.refresh_token});
  const email = currentUser.primaryEmail;
  await updateUserAccount(email, {googleRefreshToken: tokens.refresh_token});

}

async function fetchGoogleAppointments(req, res, next) {
  const { codeResponse, userId } = req.body;
  const currentUser = await findUserAccountById(userId); // This is a function from userAccount/user.js that finds a user by ID
  // Check if currentUser have googleRefreshToken
  if (currentUser.googleRefreshToken) {
    console.log("Found refresh token")
    oAuth2Client.setCredentials({refresh_token: currentUser.googleRefreshToken});
  }
  else {
    console.log("No refresh token")
    const code = req.body.code;
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials({refresh_token: tokens.refresh_token});
    const email = currentUser.primaryEmail;
    await updateUserAccount(email, {googleRefreshToken: tokens.refresh_token});
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

async function storeGoogleAppointments(req, res, next) {
  const {codeResponse, userId} = req.body;
  const currentUser = await findUserAccountById(userId); // This is a function from userAccount/user.js that finds a user by ID
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

  const calendar = google.calendar({version: 'v3', auth:
      oAuth2Client});
  // add an event to the calendar
  const event = {
    summary: 'Google Calendar API Test',
    description: 'This is a test of the Google Calendar API',
    start: {
      dateTime: '2022-01-01T09:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: '2022-01-01T17:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
  };
  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return res.status(200).json({success: true});
}



module.exports = {fetchGoogleAppointments, storeGoogleAppointments, updateGoogleLogin};