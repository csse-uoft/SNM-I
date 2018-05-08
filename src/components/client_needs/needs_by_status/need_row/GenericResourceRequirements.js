import React, { Component } from 'react';
import _ from 'lodash';
import { defaults } from '../../../../store/defaults.js';

export default class GenericResourceRequirements extends Component {

  render() {
    const p = this.props,
          requirements = p.requirements;
    return (
      <div>
        <p>Language of Service: {this.getLanguageLabelForCode(requirements['language_of_service'])}</p>
      </div>
    )
  }

  getLanguageLabelForCode = (code) => {
    if (!code) return "";
    const languageMap =  _.find(defaults.languageMap, o => { return o.value === code; });
    return languageMap.label;
  };
}