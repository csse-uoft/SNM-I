import { deleteJson, getJson, postJson, putJson } from "./index";

// this will create a temporary account during user invite process
export function createUser(params) {
  return postJson('/api/register/invite', params);
}

// this will verify user's token during first entry process
export function verifyFirstEntryUser(token) {
  return postJson('/api/register/firstEntry/verify', token)
}

// this will verify user's token during forgot password process
export function verifyForgotPasswordUser(token) {
  return postJson('/api/resetPassword/verify', {token})
}

export async function verifyChangePrimaryEmail(token) {
  return postJson('/api/update-primary-email', {token})
}

export function createUsers(params) {
  // TODO: implement backend?
  return postJson('/users/', {csv: params});
}

// this will update user's security questions and password during first entry process
export function firstEntryUpdate(params) {
  return putJson('/api/user/firstEntry', params);
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

// this will save new password during forgot and reset password process
export async function forgotPasswordSaveNewPassword(params) {
  return postJson('/api/forgotPassword/saveNewPassword/', params)
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

// this will fetch the security questions of user during forgot password process
export function fetchSecurityQuestionsByEmail(email) {
  return putJson('/api/securityQuestions/email/', {email})
}

// this will check the answer of the security function during forgot password process
// params: {email, question, answer}
export function checkSecurityQuestion(params) {
  return postJson('/api/checkSecurityQuestion/', params)
}
//  this will send the verification email during forgot password process
// params: {email}
export function sendVerificationEmail(params) {
  return postJson('/api/sendVerificationEmail/', params)
}

export function deleteUser(id, params, callback) {
  const response = deleteJson('/user/' + id + '/');
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}
