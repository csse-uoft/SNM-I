import {getJson, postJson, sleep} from './index';

/**
 * @param email
 * @param password
 * @return {Promise<{success: boolean}>}
 */
export async function login(email, password) {
  return await postJson('/api/login', {email, password});
}

export function getUserSecurityQuestionsLogin(){
  return getJson('/api/login/securityQuestions/fetch')
}

/**
 *
 * @param sessionExpired
 * @return {Promise<{success: boolean}>}
 */
export async function logout() {
  return await postJson('/api/logout');
}