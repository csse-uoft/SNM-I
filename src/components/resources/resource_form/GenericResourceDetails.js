import React, { Component } from 'react';
import Select from 'react-select';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import { defaults } from '../../../store/defaults.js';
import _ from 'lodash';

export default class GenericResourceDetails extends Component {
  constructor(props) {
    super(props);
    const details = this.props.details;
    this.state = { 
      language_of_service: details.language_of_service || ''
    };
  }

  render() {
    const s = this.state;

    return (
      <div className="details">
        <FormGroup controlId="language_of_service">
          <Col componentClass={ControlLabel} sm={3}>
            Langauge Of Service
          </Col>
          <Col sm={9}>
            <Select options={defaults.languageMap} onChange={this.updateLanguage} 
              value={s.language_of_service} />
          </Col>
        </FormGroup>

      </div>
    )
  }

  updateLanguage = (option) => {
    const newValue = option ? option.value : '',
          nextState = {language_of_service: newValue}
    this.setState(nextState);
    this.props.updateDetails(nextState);
  }
}