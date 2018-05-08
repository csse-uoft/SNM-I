import React, { Component } from 'react';
import _ from 'lodash';
import { Form, FormGroup, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { defaults } from '../../store/defaults.js';

// components
import GenericServiceRequirements from './need_controls/GenericServiceRequirements.js'
import LanguageServiceRequirements from './need_controls/LanguageServiceRequirements.js'
import EmploymentMentorRequirements from './need_controls/EmploymentMentorRequirements.js'

export default class NeedControls extends Component {
  constructor(props) {
    super(props);
    this.state = { type: props.need.type, requirements: props.need.requirements } 
  }

  render() {
    const s = this.state,
          typeSet = s.type !== '',
          RequirementsComponent = this.requirementsComponent();

    return (
      <Form className='need'>
        <FormGroup>
          <InputGroup className='type-select'>
            <Select options={defaults.resourceTypeMap} onChange={this.typeChanged} 
            value={s.type} placeholder={'Type of need...'}/>
          </InputGroup>
        </FormGroup>
        <div className='requirements'>
          {typeSet &&
            <RequirementsComponent resourceType={s.type} requirements={s.requirements} 
              saveNeed={this.saveNeed} requirementsChanged={this.requirementsChanged} />
          }
        </div>
      </Form>
    )
  }

  typeChanged = (option) => {
    const p = this.props;
    let newType = option ? option.value : "";
    this.setState({type: newType, requirements: {}}, () => {
      this.saveNeed({});
      p.fetchResources(newType, {})
    });
  }

  requirementsChanged = (requirements) => {
    const p = this.props, s = this.state,
          specifiedRequirements = _.omitBy(requirements, _.isEmpty)
    this.saveNeed(specifiedRequirements);
    p.fetchResources(s.type, specifiedRequirements);
  }

  saveNeed = (requirements) => {
    const s = this.state,
    p = this.props,
    params = {
      need_type: s.type,
      requirements: requirements
    };
    p.updateNeed(params, p.need.id);
  }

  requirementsComponent = () => {
    let Component;
    switch (this.state.type) {
      case 'interpreter':
      case 'translator':
        Component = LanguageServiceRequirements;
        break;
      case 'employment_mentor':
        Component = EmploymentMentorRequirements;
        break;
      default:
        Component = GenericServiceRequirements;
    }
    return Component;
  }

}