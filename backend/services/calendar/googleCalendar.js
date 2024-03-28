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
  const { userId } = req.body;
  try {
    const currentUser = await findUserAccountById(userId); // Finds a user by ID
    // Check if currentUser has a googleRefreshToken
    if (currentUser.googleRefreshToken) {
      console.log("Found refresh token");
      oAuth2Client.setCredentials({refresh_token: currentUser.googleRefreshToken});
    }

    const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
    const response = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 2500,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    const data = events.map(event => {
      const start = Date.parse(event.start.dateTime || event.start.date);
      const end = Date.parse(event.end.dateTime || event.end.date);
      return {startDate: start, endDate: end, appointmentName: event.summary};
    });

    return res.status(200).json({success: true, data});
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
      console.error("Refresh token is invalid or expired.");
      return res.status(401).json({success: false, message: "Authentication failed. Please log in again."});
    }
    console.error("An error occurred:", error.message);
    return res.status(500).json({success: false, message: "An internal error occurred."});
  }
}

async function storeGoogleAppointments(req, res, next) {
  const { userId } = req.body;
  try {
    const currentUser = await findUserAccountById(userId); // Finds a user by ID
    // Check if currentUser has a googleRefreshToken
    if (currentUser.googleRefreshToken) {
      oAuth2Client.setCredentials({refresh_token: currentUser.googleRefreshToken});
    }

    const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

    let startDate = new Date(req.body.start);
    let endDate = new Date(req.body.end);

    // Add an event to the calendar
    const event = {
      summary: req.body.name,
      description: 'This is a test of the Google Calendar API',
      start: {
        dateTime: startDate,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endDate,
        timeZone: 'America/Los_Angeles',
      },
    };

    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return res.status(200).json({success: true});
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
      console.error("Refresh token is invalid or expired.");
      return res.status(401).json({success: false, message: "Authentication failed. Please log in again."});
    }
    console.error("An error occurred:", error.message);
    return res.status(500).json({success: false, message: "An internal error occurred."});
  }
}



module.exports = {fetchGoogleAppointments, storeGoogleAppointments, updateGoogleLogin};