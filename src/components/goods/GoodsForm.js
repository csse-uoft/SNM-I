import React, { Component } from 'react';
import { defaults } from '../../store/defaults.js';
import _ from 'lodash';

// components
// import GenericResourceDetails from './resource_form/GenericResourceDetails.js'
// import LanguageResourceDetails from './resource_form/LanguageResourceDetails.js'
// import EmploymentMentorDetails from './resource_form/EmploymentMentorDetails.js'
// import DoctorDetails from './resource_form/DoctorDetails.js'
// import EducationDetails from './resource_form/EducationDetails.js'
// import FamilyLifeDetails from './resource_form/FamilyLifeDetails.js'
// import FinancialDetails from './resource_form/FinancialDetails.js'
// import HousingDetails from './resource_form/HousingDetails.js'
// import LegalDetails from './resource_form/LegalDetails.js'
// import MentalHealthDetails from './resource_form/MentalHealthDetails.js'
// import DentistDetails from './resource_form/DentistDetails.js'



// styles
import { Button, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';

export default class GoodsForm extends Component {
  constructor(props) {
    super(props);
    const good = this.props.good;
    this.state = { 
      form: {
        id: good.id || '',
        type: good.type || '',
        description: good.description || '',
        condition: good.condition || '',
        imagelink: good.imagelink || '',
        contactinfo: good.contactinfo || ''
      } 
    } 
  }

  render() {
    //const DetailsComponent = this.detailsComponent();
    const isEnabled = this.state.form.description.length > 0

    return (
      <Form horizontal>

        <FormGroup controlId="type">
          <Col componentClass={ControlLabel} sm={3}>
            Type
          </Col>
          <Col sm={9}>
            <Select options={defaults.goodsTypeMap} onChange={this.typeValChange} 
              value={this.state.form.type} />
          </Col>
        </FormGroup>

        <FormGroup controlId="description" rows="3">
          <Col componentClass={ControlLabel} sm={3}>
            Description (required)
          </Col>
          <Col sm={9} >
              <FormControl componentClass="textarea" type="text" value={this.state.form.description} 
                placeholder=""
                onChange={this.formValChange} />
          </Col>
        </FormGroup>

        <FormGroup controlId="condition">
          <Col componentClass={ControlLabel} sm={3}>
            Condition
          </Col>
          <Col sm={9}>
            <Select options={defaults.conditionTypeMap} value={this.state.form.condition}
            onChange={this.conditionValChange}/>
          </Col>
        </FormGroup>

        <FormGroup controlId="contactinfo">
          <Col componentClass={ControlLabel} sm={3}>
            Contact Information 
          </Col>
          <Col sm={9}>
            <FormControl type="text" value={this.state.form.contactinfo} 
                placeholder=""
                onChange={this.formValChange} />
          </Col>
        </FormGroup>

         <FormGroup controlId="imagelink">
          <Col componentClass={ControlLabel} sm={3}>
            Image Link
          </Col>
          <Col sm={9}>
            <FormControl type="text" value={this.state.form.imagelink} 
                placeholder=""
                onChange={this.formValChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={3} sm={9}>
            <Button disabled = {!isEnabled} type="submit" onClick={this.submit}>
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
    let nextForm = {...this.state.form, type: newVal};
    this.setState({ form: nextForm });    
  }

   conditionValChange = (newVal) => {
    newVal = newVal ? newVal.value : "";
    let nextForm = {...this.state.form, condition: newVal};
    this.setState({ form: nextForm });    
  }






  detailsChange = (newVal) => {
    let nextForm = {...this.state.form, details: newVal};
    this.setState({ form: nextForm });    
  }


  
}