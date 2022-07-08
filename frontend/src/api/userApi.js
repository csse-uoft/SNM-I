import { deleteJson, getJson, postJson, putJson } from "./index";

/**
 * this will create a temporary account during user invite process
 * @param params：{email, is_superuser, expirationDate}
 * @returns {Promise<Response|any>}
 */
export function createUser(params) {
  return postJson('/api/register/invite', params);
}

/**
 * this will verify user's token during first entry process
 * @param token
 * @returns {Promise<Response|any>}
 */
export function verifyFirstEntryUser(token) {
  return postJson('/api/register/firstEntry/verify', token)
}

/**
 * this will update user's security questions and password during first
 * entry process
 * @param params：{email, newPassword, securityQuestions}
 * @returns {Promise<Response|any>}
 */
export function firstEntryUpdate(params) {
  return putJson('/api/register/firstEntry/update', params);
}

/**
 * this will fetch the security questions of user during forgot password process
 * @param email
 * @returns {Promise<Response|any>}
 */
export function fetchSecurityQuestionsByEmail(email) {
  return putJson('/api/forgotPassword/securityQuestions/fetch', {email})
}

/**
 * this will check the answer of the security function during forgot password process
 * @param params:{email, question, answer}
 * @returns {Promise<Response|any>}
 */

export function checkSecurityQuestion(params) {
  return postJson('/api/forgotPassword/securityQuestions/check', params)
}

/**
 * this will send the verification email during forgot password process
 * @param params: {email}
 * @returns {Promise<Response|any>}
 */
export function sendVerificationEmail(params) {
  return postJson('/api/forgotPassword/sendVerificationEmail', params)
}

/**
 * this will verify user's token during forgot password process
 * @param token
 * @returns {Promise<Response|any>}
 */
export function verifyForgotPasswordUser(token) {
  return postJson('/api/forgotPassword/resetPassword/verify', {token})
}

/**
 * this will save new password during forgot and reset password process
 * @param params: {password, email}
 * @returns {Promise<Response|any>}
 */
export async function forgotPasswordSaveNewPassword(params) {
  return postJson('/api/forgotPassword/resetPassword/saveNewPassword/', params)
}

export async function verifyChangePrimaryEmail(token) {
  return postJson('/api/update-primary-email', {token})
}

export function createUsers(params) {
  // TODO: implement backend?
  return postJson('/users/', {csv: params});
}



export function getProfile(id) {
  return getJson('/api/profile/' + id + '/')
}

export function updateUser(id, params) {
  return postJson('/api/profile/' + id + '/', params);
}

export async function updatePrimaryEmail(id, email) {
  return postJson('/api/profile/' + id + '/edit/updatePrimaryEmail', {email})
}

export function updateProfile(id, params) {
  return postJson('/api/profile/' + id + '/edit/', params);
}

export async function checkCurrentPassword(id, password) {
  return postJson('/api/users/reset-password/' + id + '/', {password});
}

export async function saveNewPassword(id, password) {
  return postJson('/api/users/reset-password/' + id + '/update', {password});
}


export function fetchUser(id) {
  return getJson('/user/' + id + '/');
}

// export function fetchUserByEmail(email) {
//   return getJson('/api/user/' + email + '/')
// }

export function fetchUsers() {
  return getJson('/users/');
}


export function deleteUser(id, params, callback) {
  const response = deleteJson('/user/' + id + '/');
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}
