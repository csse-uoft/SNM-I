import React, { Component } from 'react';
import { defaults } from '../../store/defaults.js';
import _ from 'lodash';

// components
import GenericResourceDetails from './resource_form/GenericResourceDetails.js'
import LanguageResourceDetails from './resource_form/LanguageResourceDetails.js'
import EmploymentMentorDetails from './resource_form/EmploymentMentorDetails.js'
import DoctorDetails from './resource_form/DoctorDetails.js'
import EducationDetails from './resource_form/EducationDetails.js'
import FamilyLifeDetails from './resource_form/FamilyLifeDetails.js'
import FinancialDetails from './resource_form/FinancialDetails.js'
import HousingDetails from './resource_form/HousingDetails.js'
import LegalDetails from './resource_form/LegalDetails.js'
import MentalHealthDetails from './resource_form/MentalHealthDetails.js'
import DentistDetails from './resource_form/DentistDetails.js'



// styles
import { Button, Form, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';

export default class ResourceForm extends Component {
  constructor(props) {
    super(props);
    const resource = this.props.resource;
    this.state = { 
      form: {
        id: resource.id || '',
        provider_id: (resource.provider && resource.provider.id) || '',
        type: resource.type || '',
        details: resource.details || ''
      } 
    } 
  }

  render() {
    const DetailsComponent = this.detailsComponent();

    return (
      <Form horizontal>
        <FormGroup controlId="provider">
          <Col componentClass={ControlLabel} sm={3}>
            Provider
          </Col>
          <Col sm={9}>
            <Select options={this.providersSelectOptions()} onChange={this.providerValChange} 
              value={this.state.form.provider_id} />
          </Col>
        </FormGroup>

        <FormGroup controlId="type">
          <Col componentClass={ControlLabel} sm={3}>
            Category
          </Col>
          <Col sm={9}>
            <Select options={defaults.resourceTypeMap} onChange={this.typeValChange} 
              value={this.state.form.type} />
          </Col>
        </FormGroup>

        {!_.isEmpty(this.state.form.type) && 
          <DetailsComponent details={this.state.form.details} updateDetails={this.detailsChange} />
        }

        <FormGroup>
          <Col smOffset={3} sm={9}>
            <Button type="submit" onClick={this.submit}>
              Submit
            </Button>
          </Col>
        </FormGroup>
      </Form>
    )
  }

  submit = () => {
    this.props.action(this.state.form);
  }

  formValChange = (e) => {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });    
  }

  providerValChange = (newVal) => {
    newVal = newVal ? newVal.value : "";
    let nextForm = {...this.state.form, provider_id: newVal};
    this.setState({ form: nextForm });    
  }

  typeValChange = (newVal) => {
    newVal = newVal ? newVal.value : "";
    let nextForm = {...this.state.form, type: newVal, details: {}};
    this.setState({ form: nextForm });    
  }

  detailsChange = (newVal) => {
    let nextForm = {...this.state.form, details: newVal};
    this.setState({ form: nextForm });    
  }

  providersSelectOptions = () => {
    const options = this.props.providers.map(provider => {
      let name = provider.first_name + ' ' + provider.last_name;
      return {value: provider.id, label: name}
    })
    return options;
  }

  detailsComponent = () => {
    let Component;
    switch (this.state.form.type) {
      case 'interpreter':
      case 'translator':
        Component = LanguageResourceDetails;
        break;
      case 'employment_mentor':
        Component = EmploymentMentorDetails;
        break;
      case 'doctor':
        Component = DoctorDetails;
        break;
      case 'education':
        Component = EducationDetails;
        break;
      case 'familylife':
        Component = FamilyLifeDetails;
        break;
      case 'financial':
        Component = FinancialDetails;
        break;
      case 'housing':
        Component = HousingDetails;
        break;
      case 'legal':
        Component = LegalDetails;
        break;
      case 'mentalhealth':
        Component = MentalHealthDetails;
        break;
      case 'dentist':
        Component = DentistDetails;
        break;
      default:
        Component = GenericResourceDetails;
    }
    return Component;
  }
}