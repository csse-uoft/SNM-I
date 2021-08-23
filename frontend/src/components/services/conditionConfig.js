import { statusInCanadaOptions, genderOptions, educationLevelOptions, countryOptions, languageOptions, provinceOptions, incomeSourceOptions, maritalStatusOptions} from '../../store/defaults';
import React, { useEffect, useState, useMemo, useCallback, Comopnent } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { fetchEligibilities } from '../../api/eligibilityApi';
import { serverHost } from '../../store/defaults';


// export default function  something() {
//   // const dispatch = useDispatch();
//   const [state, setState] = useState({
//     loading: true,
//     languageOptions: [],
//     all_ngo_conditions: [],
//     stepNames: [],
//     steps: [],
//     client: null,
//     dispatchErrorMsg: [],
//     fieldErrorMsg: {},
//   });
  
//   // useEffect(() => {
//     const promises = [];
//     promises.push(fetchOntologyCategories('languages')
//       .then(data => setState(state => ({...state, languageOptions: data}))));
//     promises.push(fetchEligibilities()
//       .then(data => {
//         setState(state => ({...state, all_ngo_conditions: data.map(data => data.title)}))
//       }));
//     Promise.all(promises).then(() => setState(state => ({...state, loading: false})));
  
//     // }, [dispatch]);

//   return promises
// }
// const appRes = something()
// console.log("conditionConfig:", appRes)




// const ontologyCategories = fetchOntologyCategories('languages')
// console.log("conditionConfig: ", ontologyCategories)


// const ngoEligibilities = fetchEligibilities('languages')
// console.log("conditionConfig: ", all_ngo_conditions)
// const all_ngo_conditions= ngoEligibilities.map(data => data.title)

// const ontologyRes = retrieveOnotologyStoreConditionConfig()
// console.log("conditionConfig", ontologyRes)


// const data = await fetchEligibilities().then(data => {return data=> data.title})
// For reference
const conditions = ["age", "alt_phone_number", "apt_number", "arrival_date", "birth_date", "city", "completed_education_level",
  "country_of_last_residence", "country_of_origin", "current_education_level", "email", "first_language", "first_name", "gender",
  "has_children", "immigration_doc_number", "income_source", "landing_date", "last_name", "lat", "lng", "marital_status", "middle_name",
  "ngo_conditions", "num_of_children", "num_of_dependants", "other_languages", "phone_numbers", "postal_code", "pr_number", "preferred_name",
  "primary_phone_number", "province", "service_set", "status_in_canada", "street_address"]

const compareOps = ['<', '>', '<=', '>=', '=='];
const IN = ['in'];
const IS = ['=='];

export const TYPE = {
  NUMBER: 1,
  DATE: 2,  // use case? not implemented.
  STRING: 3,
  BOOLEAN: 4,  // use case? not implemented.
  LIST: 5
};

export const defaultConfig = {
  operators: [...compareOps, ...IN],
  type: TYPE.STRING
};

export const eligibilityConditionHideItems = ["alt_phone_number", "apt_number", "city", "landing_date", "last_name", "middle_name",
  "phone_numbers", "postal_code", "pr_number", "preferred_name", "primary_phone_number", "service_set", "street_address"
]

export const eligibilityConditionConfigs = {
  // NOTE: In alphabetic order
  age: {
    operators: compareOps,  // operators
    type: TYPE.NUMBER  // right operand data type
  },
  arrival_date: {
    operators: compareOps,
    type: TYPE.DATE
  },
  birth_date: {
    operators: compareOps,
    type: TYPE.DATE
  },
  completed_education_level: {
    operators: IN,
    type: TYPE.LIST,
    options: educationLevelOptions,
    multipleSelect: true
  },
  // Where to retrieve coutry options?
  country_of_last_residence: {
    operators: IN,
    type: TYPE.LIST,
    options: countryOptions,
    multipleSelect: true
  }, 
  country_of_origin: {
    operators: IN,
    type: TYPE.LIST,
    options: countryOptions,
    multipleSelect: true
  },
  current_education_level: {
    operators: IN,
    type: TYPE.LIST,
    options: educationLevelOptions,
    multipleSelect: true
  },
  // Where to retrieve language options, Ontology or default.js?
  first_language: {
    operators: IN,
    type: TYPE.LIST,
    options: [],
    multipleSelect: true
  },
  gender: {
    operators: IN,
    type: TYPE.LIST,
    options: genderOptions,
    multipleSelect: true,
  },
  has_children: {
    operators: IN,
    type: TYPE.LIST,
    options: ['True', 'False'],
    multipleSelect: true
  },
  income_source: {
    operators: IN,
    type: TYPE.LIST,
    options: incomeSourceOptions,
    multipleSelect: true
  },
  landing_date: {
    operators: compareOps,
    type: TYPE.DATE
  },
  lat: {
    operators: compareOps,  // operators
    type: TYPE.NUMBER  // right operand data type
  },
  lng: {
    operators: compareOps,  // operators
    type: TYPE.NUMBER  // right operand data type
  },
  marital_status: {
    operators: IN,
    type: TYPE.LIST,
    options: maritalStatusOptions,
    multipleSelect: true
  },
  // Get NGO condition
  ngo_conditions: {
    operators: IN,
    type: TYPE.LIST,
    options: ['example'],
    multipleSelect: true
  },
  num_of_children: {
    operators: compareOps,  // operators
    type: TYPE.NUMBER  // right operand data type
  },
  num_of_dependants: {
    operators: compareOps,  // operators
    type: TYPE.NUMBER  // right operand data type
  },
  other_languages: {
    operators: IN,
    type: TYPE.LIST,
    options: languageOptions,
    multipleSelect: true
  },
  province: {
    operators: IN,
    type: TYPE.LIST,
    options: provinceOptions,
    multipleSelect: true
  },
  status_in_canada: {
    operators: IN,
    type: TYPE.LIST,
    options: statusInCanadaOptions,  // only for list data type
    multipleSelect: true  // is multiple select?
  }
};


export const nameFunc = () => {
  const languagesUrl = serverHost + '/categories/languages/';
  const promises = [];
  promises.push(fetch(languagesUrl)
    .then(response => response.json())
    .then(data => {eligibilityConditionConfigs.first_language.options = data.categories;
      eligibilityConditionConfigs.other_languages.options = data.categories}));
  promises.push(fetchEligibilities()
    .then(data => eligibilityConditionConfigs.ngo_conditions.options= data.map(data => data.title)));
  Promise.all(promises)
}
// nameFunc()

