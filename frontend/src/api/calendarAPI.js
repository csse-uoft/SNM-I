import { deleteJson, getJson, postJson, putJson } from "./index";

export async function fetchCalendarAppointments (body) {
  return postJson('/api/calendar?startDate=', body);
}
