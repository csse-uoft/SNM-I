import { BrowserStore, BrowserCounterStore } from './browserStore';

const store = new BrowserStore('questions', []);
const questionCnt = new BrowserCounterStore('questions');

export async function createQuestion({content_type, text}) {
  const newQuestion = {
    id: questionCnt.nextCnt,
    content_type, text,
  };
  store.value = [...store.value, newQuestion];
  return {...newQuestion};
}

export async function updateQuestion(id, {content_type, text}) {
  Object.assign(store.value.find(question => question.id === Number(id)), {content_type, text});
  store.save();
  return {id, content_type, text};
}

export async function fetchQuestion(id) {
  return {...(store.value.find(question => question.id === Number(id)))}
}

export async function fetchQuestions() {
  // ugly deep copy
  return JSON.parse(JSON.stringify(store.value));
}

export async function deleteQuestion(id) {
  const idx = store.value.findIndex(question => question.id === id);
  store.value.splice(idx, 1)
  store.save();
}
