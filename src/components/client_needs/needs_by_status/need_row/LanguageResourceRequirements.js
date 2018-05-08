import React, { Component } from 'react';
import _ from 'lodash';
import { defaults } from '../../../../store/defaults.js';

export default class LanguageResourceRequirements extends Component {

  render() {
    const p = this.props,
          requirements = p.requirements;
    return (
      <div>
        {_.has(requirements, 'source_lang') &&
          <p>Source Language: {this.getLanguageLabelForCode(requirements['source_lang'])}</p>
        }
        {_.has(requirements, 'target_lang') &&
          <p>Target Language: {this.getLanguageLabelForCode(requirements['target_lang'])}</p>
        }
        {_.has(requirements, 'professional') &&
          <p>ATIO Certified: {requirements['professional'] ? 'Yes' : 'No'}</p>
        }
      </div>
    )
  }

  getLanguageLabelForCode = (code) => {
    const languageMap =  _.find(defaults.languageMap, o => { return o.value === code; });
    return languageMap.label;
  };
}