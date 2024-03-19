import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchCalendarAppointments (body) {
  return postJson('/api/calendar?startDate=', body);
}

export async function fetchGoogleCalendarAppointments (body) {
  return postJson('/api/calendar_google', body);
}