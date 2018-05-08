import React, { Component } from 'react';
import _ from 'lodash';
import { defaults } from '../../../../store/defaults.js';

export default class GenericResourceDetails extends Component {

  render() {
    const p = this.props,
          details = p.details;
    return (
      <div>
        <p>Language of Service: {this.getLanguageLabelForCode(details['language_of_service'])}</p>
      </div>
    )
  }

  getLanguageLabelForCode = (code) => {
    const languageMap =  _.find(defaults.languageMap, o => { return o.value === code; });
    return languageMap.label;
  };
}