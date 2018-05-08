import React, { Component } from 'react';
import _ from 'lodash';
import { defaults } from '../../../../store/defaults.js';

export default class LanguageResourceDetails extends Component {

  render() {
    const p = this.props,
          details = p.details;
    return (
      <div>
        <p>Source Language: {this.getLanguageLabelForCode(details['source_lang'])}</p>
        <p>Target Language: {this.getLanguageLabelForCode(details['target_lang'])}</p>
        <p>ATIO Certified: {details['professional'] ? 'Yes' : 'No'}</p>
      </div>
    )
  }

  getLanguageLabelForCode = (code) => {
    const languageMap =  _.find(defaults.languageMap, o => { return o.value === code; });
    return languageMap.label;
  };
}