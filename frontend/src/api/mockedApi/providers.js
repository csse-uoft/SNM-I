import { BrowserStore, BrowserCounterStore } from './browserStore';
import { sleep } from "../index";

const providersStore = new BrowserStore('providers', []);
const providerCnt = new BrowserCounterStore('provider');

export async function fetchProviders() {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(providersStore.value));
}

export async function fetchProvider(id) {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(providersStore.value.find(provider => provider.id === Number(id))));
}


export async function createProvider(newProviderData) {
  await sleep(200);
  const newProvider = {
    id: providerCnt.nextCnt,
    reviews: [],
    ...newProviderData
  };
  providersStore.value = [...providersStore.value, newProvider];
  return {success: true, providerId: newProvider.id};
  // return {success: false, error: 'error message here'}
}

export async function updateProvider(id, updatedProvider) {
  await sleep(200);
  Object.assign(providersStore.value.find(provider => provider.id === Number(id)), updatedProvider);
  providersStore.save();
  return {success: true, providerId: id};
  // return {success: false, error: 'error message here'}
}


export async function deleteProvider(updatedProvider) {
  await sleep(200);
  const idx = providersStore.value.findIndex(provider => provider.id === updatedProvider.id);
  providersStore.value.splice(idx, 1)
  providersStore.save();
  return {success: true}
}
