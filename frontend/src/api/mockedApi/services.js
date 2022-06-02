import { BrowserStore, BrowserCounterStore } from './browserStore';
import { sleep } from "../index";

const servicesStore = new BrowserStore('services', []);
const serviceCnt = new BrowserCounterStore('service');

export async function fetchServices() {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(servicesStore.value));
}

export async function fetchService(id) {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(servicesStore.value.find(service => service.id === Number(id))));
}


export async function createService(newServiceData) {
  await sleep(200);
  const newService = {
    id: serviceCnt.nextCnt,
    reviews: [],
    ...newServiceData
  };
  servicesStore.value = [...servicesStore.value, newService];
  return {success: true, serviceId: newService.id};
  // return {success: false, error: 'error message here'}
}

export async function updateService(id, updatedService) {
  await sleep(200);
  Object.assign(servicesStore.value.find(service => service.id === Number(id)), updatedService);
  servicesStore.save();
  return {success: true, serviceId: id};
  // return {success: false, error: 'error message here'}
}


export async function deleteService(updatedService) {
  await sleep(200);
  const idx = servicesStore.value.findIndex(service => service.id === updatedService.id);
  servicesStore.value.splice(idx, 1)
  servicesStore.save();
  return {success: true}
}
