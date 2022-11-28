import { deleteJson, getJson, postJson, putJson } from "./index";

export async function createDynamicForm(params) {
  return postJson('/api/dynamicForm', params);
}

export async function updateDynamicForm(id, params) {
  return putJson('/api/dynamicForm/' + id, params);
}

export async function getDynamicForm(id) {
  return getJson('/api/dynamicForm/' + id + '/');
}

export async function getAllDynamicForms() {
  return getJson('/api/dynamicForms');
}

export async function getDynamicFormsByFormType(formType) {
  return getJson('/api/dynamicForms/' + formType);
}

export async function deleteDynamicForm(id) {
  return deleteJson('/api/dynamicForm/' + id);
}

export async function getInstancesInClass(className) {
  return getJson('/api/dynamicClassInstances/' + className);
}

export async function getURILabel(uri) {
  return (await getJson('/api/label/' + encodeURIComponent(uri))).label;
}
