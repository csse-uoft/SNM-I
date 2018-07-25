import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

// redux
import { connect } from 'react-redux';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClient, updateClient } from '../../store/actions/clientActions.js';

import PersonalInformationFields from './client_form/PersonalInformationFields';
import FamilyInformationFields from './client_form/FamilyInformationFields';
import BackgroundInformationFields from './client_form/BackgroundInformationFields';
import FormWizard from './client_form/FormWizard';

import { Grid, Button, Form, Col, Row, Checkbox } from 'react-bootstrap';

class ClientForm extends Component {
  constructor(props) {
    super(props);
    let client = {};
    if (this.props.match.params.id) {
      client = this.props.clientsById[this.props.match.params.id]
    }

    this.state = {
      currentStep: 1,
      clientId: client.id,
      mode: (client.id) ? 'edit' : 'new',
      form: {
        personal_information: Object.assign({
          first_name: '',
          middle_name: '',
          last_name: '',
          preferred_name: '',
          gender: '',
          birth_date: '',
          marital_status: '',
          has_children: false,
          num_of_children: '',
          email: '',
          primary_phone_number: '',
          alt_phone_number: '',
          address: Object.assign({
            street_address: '',
            apt_number: '',
            city: '',
            province: '',
            postal_code: ''
          }, client.personal_information && client.personal_information.address),
        }, _.omit(client.personal_information, 'address')),
        country_of_origin: client.country_of_origin || '',
        country_of_last_residence: client.country_of_last_residence || '',
        first_language: client.first_language || '',
        other_languages: client.other_languages || [],
        pr_number: client.pr_number || '',
        immigration_doc_number: client.immigration_doc_number || '',
        landing_date: client.landing_date || '',
        arrival_date: client.arrival_date || '',
        status_in_canada: client.status_in_canada || '',
        income_source: client.income_source || '',
        level_of_education: client.level_of_education || '',
        num_of_dependants: client.num_of_dependants || '',
        family: {
          file_id: (client.family && client.family.file_id) || '',
          spouse: client.spouse || undefined,
          children: client.children || []
        }
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.spouseChange = this.spouseChange.bind(this);
    this.childChange = this.childChange.bind(this);
    this.personalInfoChange = this.personalInfoChange.bind(this);
    this.submit = this.submit.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
  }

  next() {
   this.setState({
     currentStep: this.state.currentStep + 1
   });
  }

  prev() {
    this.setState({
      currentStep: this.state.currentStep - 1
    });
  }

  handleStepClick(step) {
    this.setState({
      currentStep: step
    });
  }

  formValChange(e, id=e.target.id) {
    let nextForm = _.clone(this.state.form);
    if (id === 'file_id') {
      nextForm['family']['file_id'] = e.target.value
    }
    else if (id === 'other_languages') {
      if (e.target.checked) {
        nextForm['other_languages'].push(e.target.value)
      } else {
        _.remove(nextForm['other_languages'], (language) => {
          return language === e.target.value
        });
      }
    }
    else {
      nextForm[id] = e.target.value
    }
    this.setState({ form: nextForm });
  }

  personalInfoChange(e, id=e.target.id) {
    let nextForm = _.clone(this.state.form);
    nextForm['personal_information'][id] = e.target.value
    if (id === 'marital_status' && (e.target.value === 'Married' || e.target.value === 'Common Law')) {
      nextForm['personal_information'][id] = e.target.value
      nextForm['family']['spouse'] = {
        'full_name': '',
        'birth_date': '',
        'gender': ''
      }
    }
    else if (id === 'num_of_children') {
      nextForm['personal_information'][id] = e.target.value
      let children = []
      for (var i = 0; i < parseInt(e.target.value, 10); i++) {
        children.push(
          {
            'full_name': '',
            'birth_date': '',
            'gender': ''
          }
        )
      }
      nextForm['family']['children'] = children
    }
    this.setState({ form: nextForm });
  }

  addressChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['personal_information']['address'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  spouseChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['family']['spouse'][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  childChange(e, index) {
    let nextForm = _.clone(this.state.form);
    nextForm['family']['children'][index][e.target.id] = e.target.value
    this.setState({ form: nextForm });
  }

  submit() {
    let submitForm = _.clone(this.state.form);
    if (submitForm['family']['children'].length > 0) {
      const children = _.map(submitForm['family']['children'], (child) => {
        return {...child, relationship: 'children'}
      })
      submitForm['family']['members'] = children
    }
    if (submitForm['family']['spouse']) {
      const spouse = {...submitForm['family']['spouse'], relationship: 'spouse'}
      if (!submitForm['family']['members']) {
        submitForm['family']['members'] = []
      }
      submitForm['family']['members'].push(spouse)
    }
    delete submitForm['family']['spouse']
    delete submitForm['family']['children']

    if (this.state.mode === 'edit') {
      this.props.dispatch(updateClient(this.state.clientId, submitForm));
    } else {
      this.props.dispatch(createClient(submitForm));
    }
    this.props.history.push('/clients')
  }

  render() {
    const p = this.props;
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Client Profile' : 'New Client Profile'

    function cateogiresIntoOptions(categories) {
      return categories.map((category) => {
        return <option key={category} value={category}>{category}</option>
      })
    }

    function cateogiresIntoCheckboxes(categories, categoryToRemove, checkedCategories, formValChange) {
      let updatedCategories = _.clone(categories)
      _.remove(updatedCategories, (category) => { return category === categoryToRemove });
      return updatedCategories.map((category) => {
        return (
          <Checkbox
            key={category}
            value={category}
            checked={_.includes(checkedCategories, category)}
            onChange={e => formValChange(e, 'other_languages')}
            inline
          >
            {category}
          </Checkbox>
        )
      })
    }

    const stepTitles = [
      "Personal Information",
      "Family Members (Optional)",
      "Background Information (Optional)"
    ];

    return (
      <Grid className="content">
        <Row>
          <Col sm={12}>
            <h3>{formTitle}</h3>
          </Col>
          <FormWizard
            stepTitles={stepTitles}
            currentStep={this.state.currentStep}
            handleStepClick={this.handleStepClick}
          />
        </Row>
        <Form horizontal>
          {this.state.currentStep === 1 &&
            <PersonalInformationFields
              personalInformation={this.state.form.personal_information}
              handleFormValChange={this.personalInfoChange}
              addressChange={this.addressChange}
            />
          }
          {this.state.currentStep === 2 &&
            <FamilyInformationFields
              family={this.state.form.family}
              hasChildren={this.state.form.personal_information.has_children}
              maritalStatus={this.state.form.personal_information.marital_status}
              numOfChildren={this.state.form.personal_information.num_of_children}
              formValChange={this.formValChange}
              spouseChange={this.spouseChange}
              childChange={this.childChange}
            />
          }
          {this.state.currentStep === 3 &&
            <BackgroundInformationFields
              country_of_origin={this.state.form.country_of_origin}
              country_of_last_residence={this.state.form.country_of_last_residence}
              first_language={this.state.form.first_language}
              other_languages={this.state.form.other_languages}
              pr_number={this.state.form.pr_number}
              immigration_doc_number={this.state.form.immigration_doc_number}
              landing_date={this.state.form.landing_date}
              arrival_date={this.state.form.arrival_date}
              formValChange={this.formValChange}
              categoriesLoaded={p.categoriesLoaded}
              languagesCategories={p.languagesCategories}
              cateogiresIntoCheckboxes={cateogiresIntoCheckboxes}
              cateogiresIntoOptions={cateogiresIntoOptions}
              num_of_dependants={this.state.form.num_of_dependants}
              income_source={this.state.form.income_source}
              level_of_education={this.state.form.level_of_education}
              status_in_canada={this.state.form.status_in_canada}
            />
          }
          <Row>
            {this.state.currentStep > 1 &&
              <Button className="previous-button" onClick={this.prev}>
                Previous
              </Button>
            }
            {(this.state.currentStep < 3) ? (
              <Button className="next-button" onClick={this.next}>
                Next
              </Button>) : (
              <Button className="submit-button" onClick={this.submit}>
                Submit
              </Button>)
            }
          </Row>
        </Form>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    clientsById: state.clients.byId,
    languagesCategories: state.ontology.languages.categories,
    categoriesLoaded: state.ontology.languages.loaded
  }
}

export default connect(mapStateToProps)(withRouter(ClientForm));
