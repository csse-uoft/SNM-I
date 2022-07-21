import { getJson } from "./index";

export async function fetchFormulaFields() {
  return {
    "fields": [
      "age",
      "alt_phone_number",
      "apt_number",
      "arrival_date",
      "birth_date",
      "city",
      "completed_education_level",
      "country_of_last_residence",
      "country_of_origin",
      "current_education_level",
      "email",
      "first_language",
      "first_name",
      "gender",
      "has_children",
      "immigration_doc_number",
      "income_source",
      "landing_date",
      "last_name",
      "lat",
      "lng",
      "marital_status",
      "middle_name",
      "ngo_conditions",
      "num_of_children",
      "num_of_dependants",
      "other_languages",
      "phone_numbers",
      "postal_code",
      "pr_number",
      "preferred_name",
      "primary_phone_number",
      "province",
      "service_set",
      "status_in_canada",
      "street_address"
    ],
    "dynamic_fields": [
      "TODAY"
    ],
    "functions": []
  }
  // return getJson('/formula/fields/');
}

