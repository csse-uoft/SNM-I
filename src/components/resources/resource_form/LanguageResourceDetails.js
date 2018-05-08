import React, { Component } from 'react';
import Select from 'react-select';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import { defaults } from '../../../store/defaults.js';
import _ from 'lodash';

export default class LanguageResourceDetails extends Component {
  constructor(props) {
    super(props);
    const details = this.props.details;
    this.state = { 
      source_lang: details.source_lang || '',
      target_lang: details.target_lang || ''
   };
  }

  render() {
    const s = this.state;

    return (
      <div className="details">
        <FormGroup controlId="source_lang">
          <Col componentClass={ControlLabel} sm={3}>
            Source Language
          </Col>
          <Col sm={9}>
            <Select options={defaults.languageMap} onChange={this.updateSourceLang} 
              value={s.source_lang} />
          </Col>
        </FormGroup>

        <FormGroup controlId="target_lang">
          <Col componentClass={ControlLabel} sm={3}>
            Target Language
          </Col>
          <Col sm={9}>
            <Select options={defaults.languageMap} onChange={this.updateTargetLang} 
              value={s.target_lang} />
          </Col>
        </FormGroup>
      </div>
    )
  }

  updateSourceLang = (option) => {
    const newValue = option ? option.value : '';
    this.updateLanguage('source_lang', newValue);
  }

  updateTargetLang = (option) => {
    const newValue = option ? option.value : '';
    this.updateLanguage('target_lang', newValue);
  }

  updateLanguage = (field, val) => {
    const nextState = {...this.state, [field]: val}
    this.setState(nextState);
    this.props.updateDetails(nextState);
  }
}