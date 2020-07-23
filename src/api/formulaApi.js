import { getJson } from "./index";

export function fetchFormulaFields() {
  return getJson('/formula/fields/');
}

