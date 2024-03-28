import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchCalendarAppointments (body) {
  return postJson('/api/calendar?startDate=', body);
}

export async function updateGoogleLogin(body) {
  return postJson('/api/calendar_google_login', body);
}

export async function fetchGoogleCalendarAppointments (body) {
  return postJson('/api/calendar_google', body);
}

export async function storeGoogleCalendarAppointments (body) {
  return putJson('/api/calendar_google', body);
}