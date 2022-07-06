import { deleteJson, getJson, postJson, putJson } from "./index";

export function createUser(params) {
  return postJson('/api/users/invite', params);
}

export function verifyFirstEntryUser(token) {
  return postJson('/api/users/firstEntry/verify', token)
}

export function verifyForgotPasswordUser(token) {
  return postJson('/api/resetPassword/verify', {token})
}

export function createUsers(params) {
  // TODO: implement backend?
  return postJson('/users/', {csv: params});
}

export function firstEntryUpdate(params) {
  return putJson('/api/user/firstEntry', params);
}

export function getProfile(id) {
  return getJson('/api/profile/' + id + '/')
}

export function updateUser(id, params) {
  return postJson('/api/profile/' + id + '/', params);
}

export function updateProfile(id, params) {
  return postJson('/api/profile/' + id + '/edit', params);
}

export function checkCurrentPassword(id, params) {
  return postJson('/api/users/reset-password/' + id + '/', params);
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

export function fetchSecurityQuestionsByEmail(email) {
  return putJson('/api/securityQuestions/email/', {email})
}

export function checkSecurityQuestion(params) {
  return postJson('/api/checkSecurityQuestion/', params)
}

export function sendVerificationEmail(params) {
  return postJson('/api/sendVerificationEmail/', params)
}

export function deleteUser(id, params, callback) {
  const response = deleteJson('/user/' + id + '/');
  if (response.status !== 204)
    throw Error('Server does not return correct code.');
}
