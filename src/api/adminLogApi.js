import { getJson } from "./index";

export async function fetchAdminLogs() {
  return getJson('/admin_logs/');
}
