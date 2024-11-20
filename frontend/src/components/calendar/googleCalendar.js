// services/googleCalendarService.js
import { google } from 'googleapis';

// These values should be stored in your environment variables
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Initialize the Calendar API
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export const generateAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

export const createGoogleCalendarEvent = async (appointment) => {
  try {
    const event = {
      summary: appointment.characteristicOccurrences['Title'],
      description: appointment.characteristicOccurrences['Description'],
      start: {
        dateTime: appointment.date.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(appointment.date.getTime() + 60 * 60 * 1000).toISOString(), // Default 1 hour duration
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};