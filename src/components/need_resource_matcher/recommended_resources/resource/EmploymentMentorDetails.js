import React, { Component } from 'react';
import _ from 'lodash';
import { defaults } from '../../../../store/defaults.js';

export default class EmploymentMentorDetails extends Component {

  render() {
    const p = this.props,
          details = p.details;
    return (
      <div>
        <p>Profession: {this.getProfessionLabelForCode(details['profession'])}</p>
        <p>Language of Service: {this.getLanguageLabelForCode(details['language_of_service'])}</p>
      </div>
    )
  }

  getLanguageLabelForCode = (code) => {
    const languageMap =  _.find(defaults.languageMap, o => { return o.value === code; });
    return languageMap.label;
  };

  getProfessionLabelForCode = (code) => {
    const professionType =  _.find(defaults.professionTypeMap, o => { return o.value === code; });
    return professionType.label;
  };
}