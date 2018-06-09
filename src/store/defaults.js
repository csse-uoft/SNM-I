//export const serverHost = 'https://snm-impact-server.herokuapp.com';
export const serverHost = 'http://127.0.0.1:8000';


const needStatus = {
  0: "Unmatched",
  1: "Pending",
  2: "In Progress",
  3: "Matched",
  4: "Fulfilled"
}

export const defaults = {
  needStatus: needStatus
}
