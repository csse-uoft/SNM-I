import { serverHost } from '../store/defaults.js';

export const ACTION_SUCCESS = 'ACTION_SUCCESS';
export const ACTION_ERROR = 'ACTION_ERROR';

export async function getJson(url, context) {
  url = serverHost + url;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include'
  });
  if (response.status === 403) {
    // session expired
    const e = new Error("Session expired, please login again");
    e.json = await response.json();
    e.json.message = "Session expired, please login again";
    console.log(e);
    if (context)
      context.logout();
    else
      throw e;
  }
  if (response.status >= 400 && response.status < 600) {
    const e = new Error("Bad response from server: " + response.status);
    e.json = await response.json();
    throw e;
  }
  return response.json();
}

async function sendJson({url, body, method, rawResponse = false, context}) {
  url = serverHost + url;
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status == 403) {
    // session expired
    const e = new Error("Session expired, please login again");
    e.json = await response.json();
    e.json.message = "Session expired, please login again";
    console.log(e);
    if (context)
      context.logout();
    else
      throw e;
  }
  if (response.status >= 400 && response.status < 600) {
    const e = new Error("Bad response from server: " + response.status);
    e.json = await response.json();
    throw e;
  }
  if (rawResponse)
    return response;
  return response.json();
}

export async function postJson(url, body, context) {
  return sendJson({url, body, method: 'POST', context});
}

export async function putJson(url, body, context) {
  return sendJson({url, body, method: 'PUT', context});
}

// return raw response
export async function deleteJson(url, body, context) {
  return sendJson({url, body, method: 'DELETE', context});
}

export function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds)
  })
}