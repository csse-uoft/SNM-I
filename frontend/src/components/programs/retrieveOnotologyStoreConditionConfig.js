// import React, { useEffect, useState, useMemo, useCallback, Comopnent } from 'react';
// import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
// import { fetchEligibilities } from '../../api/eligibilityApi';

// class retrieveOnotologyStoreConditionConfig extends Comopnent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data:null
//     }
//   }

//   componentDidMount() {
//     fetchOntologyCategories('languages')
//       .then(data => this.setState(state => ({...state, languageOptions: data})))
//     fetchEligibilities()
//       .then(data => {
//         this.setState(state => ({...state, all_ngo_conditions: data.map(data => data.title)}))
//       })
//   }
// }

// export default retrieveOnotologyStoreConditionConfig;