import fetch from 'isomorphic-fetch';
import { serverHost } from '../store/defaults.js';

export const ACTION_SUCCESS = 'ACTION_SUCCESS';
export const ACTION_ERROR = 'ACTION_ERROR';

export const headers = {
  Authorization: `JWT ${localStorage.getItem('jwt_token')}`
};

const normalizeError = (err) => {
  for (const [key, value] of Object.entries(err)) {
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      err[key] = normalizeError(value);
    } else {
      err[key] = value[0];
    }
  }
  return err;
};

export async function getJson(url) {
  url = serverHost + url;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
    },
  });
  if (response.status >= 400 && response.status < 600) {
    const e = new Error("Bad response from server: " + response.status);
    e.json = normalizeError(await response.json());
    throw e;
  }
  return response.json();
}

async function sendJson(url, body, method, rawResponse = false) {
  url = serverHost + url;
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
    },
  });
  if (response.status >= 400 && response.status < 600) {
    const e = new Error("Bad response from server: " + response.status);
    e.json = normalizeError(await response.json());
    throw e;
  }
  if (rawResponse)
    return response;
  return response.json();
}

export async function postJson(url, body) {
  return sendJson(url, body, 'POST');
}

export async function putJson(url, body) {
  return sendJson(url, body, 'PUT');
}

// return raw response
export async function deleteJson(url, body) {
  return sendJson(url, body, 'DELETE', true);
}