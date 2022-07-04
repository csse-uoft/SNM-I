import { deleteJson, getJson, postJson, putJson } from "./index";

export function createUser(params) {
  return postJson('/api/users/invite', params);
}

export function verifyUser(token) {
  return postJson('/api/users/firstEntry/verify', token)
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

export function updateProfile(id, params) {
  return postJson('/api/profile/' + id + '/', params);
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
