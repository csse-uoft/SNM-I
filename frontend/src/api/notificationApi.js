import { getJson, postJson, putJson } from "./index";

export async function createNotification(params) {
  return postJson('/api/notification', params);
}

export async function updateNotification(id, params) {
  return putJson('/api/notification/' + id, params);
}

export async function fetchNotification(id) {
  return getJson('/api/notification/' + id);
}

export async function fetchNotifications() {
  return getJson('/api/notifications');
}
