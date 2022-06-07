import { postJson, sleep } from './index';

/**
 * @param email
 * @param password
 * @return {Promise<{success: boolean}>}
 */
export async function login(email, password) {
  return await postJson('/api/login', {email, password});
}

/**
 *
 * @param sessionExpired
 * @return {Promise<{success: boolean}>}
 */
export async function logout(sessionExpired) {
  return await postJson('/api/logout');
}