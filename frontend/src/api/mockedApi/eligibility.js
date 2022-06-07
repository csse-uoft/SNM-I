import { BrowserStore, BrowserCounterStore } from './browserStore';

const store = new BrowserStore('eligibility', []);
const eligibilityCnt = new BrowserCounterStore('eligibility');

export async function createEligibility({title}) {
  const newEligibility = {
    id: eligibilityCnt.nextCnt,
    title,
  };
  store.value = [...store.value, newEligibility];
  return {...newEligibility};
}

export async function updateEligibility(id, {title}) {
  Object.assign(store.value.find(eligibility => eligibility.id === Number(id)), {title});
  store.save();
  return {id, title};
}

export async function fetchEligibility(id) {
  return {...(store.value.find(eligibility => eligibility.id === Number(id)))}
}

export async function fetchEligibilities() {
  // ugly deep copy
  return JSON.parse(JSON.stringify(store.value));
}

export async function deleteEligibility(id, params) {
  const idx = store.value.findIndex(eligibility => eligibility.id === id);
  store.value.splice(idx, 1)
  store.save();
}
