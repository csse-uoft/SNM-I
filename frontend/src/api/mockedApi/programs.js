import { BrowserStore, BrowserCounterStore } from './browserStore';
import { sleep } from "../index";

const programsStore = new BrowserStore('programs', []);
const programCnt = new BrowserCounterStore('program');

export async function fetchPrograms() {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(programsStore.value));
}

export async function fetchProgram(id) {
  await sleep(200);
  // ugly deep copy
  return JSON.parse(JSON.stringify(programsStore.value.find(program => program.id === Number(id))));
}


export async function createProgram(newProgramData) {
  await sleep(200);
  const newProgram = {
    id: programCnt.nextCnt,
    reviews: [],
    ...newProgramData
  };
  programsStore.value = [...programsStore.value, newProgram];
  return {success: true, programId: newProgram.id};
  // return {success: false, error: 'error message here'}
}

export async function updateProgram(id, updatedProgram) {
  await sleep(200);
  Object.assign(programsStore.value.find(program => program.id === Number(id)), updatedProgram);
  programsStore.save();
  return {success: true, programId: id};
  // return {success: false, error: 'error message here'}
}


export async function deleteProgram(updatedProgram) {
  await sleep(200);
  const idx = programsStore.value.findIndex(program => program.id === updatedProgram.id);
  programsStore.value.splice(idx, 1)
  programsStore.save();
  return {success: true}
}
