import React, { Component } from 'react';
import Select from 'react-select';
import { FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import { defaults } from '../../../store/defaults.js';
import _ from 'lodash';

export default class EmploymentMentorRequirements extends Component {
  constructor(props) {
    super(props);

    this.defaultProps = {
      profession: '',
      language_of_service: '' 
    }
    if (_.isEmpty(props.requirements)) {
      this.state = this.defaultProps
    } else {
      this.state = props.requirements
    }
  }

  render() {
    const s = this.state;

    return (
      <FormGroup>
        <InputGroup className='profession-select'>
          <ControlLabel>Profession</ControlLabel>
          <Select options={defaults.professionTypeMap} onChange={this.updateProfession} 
            value={s.profession} />
        </InputGroup>
        <InputGroup className='language-of-service-select'>
          <ControlLabel>Language of Service</ControlLabel>
          <Select options={this.languageOptionsMap()} onChange={this.updateLanguage} 
            value={s.language_of_service} />
        </InputGroup>
      </FormGroup>
    )
  }

  updateLanguage = (option) => {
    const newValue = option ? option.value : this.defaultProps.language_of_service;
    this.setState({language_of_service: newValue});
  }

  updateProfession = (option) => {
    const newValue = option ? option.value : this.defaultProps.profession;
    this.setState({profession: newValue});
  }

  languageOptionsMap = () => {
    let map = _.clone(defaults.languageMap);
    map.unshift({value: "", label: "Any"});
    return map;
  }

  componentWillUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state, nextState)) {
      this.props.requirementsChanged(nextState);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resourceType !== nextProps.resourceType) {
      this.setState(this.defaultProps)
    }
  }
}