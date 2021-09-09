import { BrowserStore, BrowserCounterStore } from './browserStore';
import { sleep } from "../index";

const clientsStore = new BrowserStore('clients', []);
const clientCnt = new BrowserCounterStore('client');

export async function fetchClients() {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(clientsStore.value));
}

export async function fetchClient(id) {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(clientsStore.value.find(client => client.id === Number(id))));
}


export async function createClient(newClientData) {
  await sleep(200);
  const newClient = {
    id: clientCnt.nextCnt,
    need_groups: [],
    appointments: [],
    ...newClientData
  };
  clientsStore.value = [...clientsStore.value, newClient];
  return {success: true, clientId: newClient.id};
  // return {success: false, error: 'error message here'}
}

export async function updateClient(id, updatedClient) {
  await sleep(200);
  Object.assign(clientsStore.value.find(client => client.id === Number(id)), updatedClient);
  clientsStore.save();
  return {success: true, clientId: id};
  // return {success: false, error: 'error message here'}
}


export async function deleteClient(updatedClient) {
  await sleep(200);
  const idx = clientsStore.value.findIndex(client => client.id === updatedClient.id);
  clientsStore.value.splice(idx, 1)
  clientsStore.save();
  return {success: true}
}
