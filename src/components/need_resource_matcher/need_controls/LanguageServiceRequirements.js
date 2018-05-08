import React, { Component } from 'react';
import Select from 'react-select';
import { FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import { defaults } from '../../../store/defaults.js';
import _ from 'lodash';

export default class LanguageServiceRequirements extends Component {
  constructor(props) {
    super(props);

    this.defaultProps = {
      source_lang: '',
      target_lang: ''
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
        <InputGroup className='language-select source'>
          <ControlLabel>Source Language</ControlLabel>
          <Select options={this.languageOptionsMap()} onChange={this.updateSourceLang} 
            value={s.source_lang} />
        </InputGroup>
        <InputGroup className='language-select target'>
          <ControlLabel>Target Language</ControlLabel>
          <Select options={this.languageOptionsMap()} onChange={this.updateTargetLang} 
            value={s.target_lang} />
        </InputGroup>
      </FormGroup>
    )
  }

  updateSourceLang = (option) => {
    const newValue = option ? option.value : this.defaultProps.source_lang;
    this.setState({source_lang: newValue});
  }

  updateTargetLang = (option) => {
    const newValue = option ? option.value : this.defaultProps.target_lang;
    this.setState({target_lang: newValue});
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

  languageOptionsMap = () => {
    let map = _.clone(defaults.languageMap);
    map.unshift({value: "", label: "Any"});
    return map;
  }
}