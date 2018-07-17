import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

// redux
import { connect } from 'react-redux';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClient, updateClient } from '../../store/actions/clientActions.js';

import PersonalInformationFields from './client_form/PersonalInformationFields';
import FamilyInformationFields from './client_form/FamilyInformationFields';

import { Grid, Button, Form, FormGroup, FormControl, ControlLabel, Col, Row,
  Radio, Checkbox } from 'react-bootstrap';

class ClientForm extends Component {
  constructor(props) {
    super(props);
    let client = {};
    if (this.props.match.params.id) {
      client = this.props.clientsById[this.props.match.params.id]
    }

    this.state = {
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
        }, client.personal_information),
        email: client.email || '',
        primary_phone_number: client.primary_phone_number || '',
        alt_phone_number: client.alt_phone_number || '',
        address: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, client.address),
        country_of_origin: client.country_of_origin || '',
        country_of_last_residence: client.country_of_last_residence || '',
        first_language: client.first_language || '',
        other_languages: client.other_languages || [],
        pr_number: client.pr_number || '',
        immigration_doc_number: client.immigration_doc_number || '',
        landing_date: client.landing_date || '',
        arrival_date: client.arrival_date || '',
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
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
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
      for (var i = 0; i < parseInt(e.target.value); i++) {
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
    nextForm['address'][e.target.id] = e.target.value
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
      let form = Object.assign({}, submitForm);
      this.props.dispatch(updateClient(this.state.clientId, form));
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

    return (
      <Grid className="content">
        <Row>
          <Col sm={12}>
            <h3>{formTitle}</h3>
            <hr />
          </Col>
        </Row>
        <Form horizontal>
          <PersonalInformationFields
            personalInformation={this.state.form.personal_information}
            formValChangeHandler={this.personalInfoChange}
          />
          <Row>
            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.email}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="primary_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Telephone
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.primary_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="alt_phone_number">
              <Col componentClass={ControlLabel} sm={3}>
                Alternative Phone Number
              </Col>
              <Col sm={9}>
                <FormControl
                  type="tel"
                  value={this.state.form.alt_phone_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="street_address">
              <Col componentClass={ControlLabel} sm={3}>
                Street Address
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address.street_address}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="apt_number">
              <Col componentClass={ControlLabel} sm={3}>
                Apt. #
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address.apt_number}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="city">
              <Col componentClass={ControlLabel} sm={3}>
                City
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address.city}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="province">
              <Col componentClass={ControlLabel} sm={3}>
                Province
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address.province}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="postal_code">
              <Col componentClass={ControlLabel} sm={3}>
                Postal Code
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.address.postal_code}
                  onChange={this.addressChange}
                />
              </Col>
            </FormGroup>
          </Row>
          <br/>
          <FamilyInformationFields
            family={this.state.form.family}
            hasChildren={this.state.form.personal_information.has_children}
            maritalStatus={this.state.form.personal_information.marital_status}
            numOfChildren={this.state.form.personal_information.num_of_children}
            formValChange={this.formValChange}
            spouseChange={this.spouseChange}
            childChange={this.childChange}
          />
          <Row>
            <Col sm={12}>
              <h4>Country of Origin Information</h4>
              <hr/>
            </Col>
            <FormGroup controlId="country_of_origin">
              <Col componentClass={ControlLabel} sm={3}>
                Country of Origin
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.country_of_origin}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="country_of_last_residence">
              <Col componentClass={ControlLabel} sm={3}>
                Country of Last Residence
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.country_of_last_residence}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="first_language">
              <Col componentClass={ControlLabel} sm={3}>
                First Language
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.first_language}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  { p.categoriesLoaded &&
                    cateogiresIntoOptions(p.languagesCategories)
                  }
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="other_languages">
              <Col componentClass={ControlLabel} sm={3}>
                Other languages
              </Col>
              <Col sm={9}>
                {p.categoriesLoaded &&
                  cateogiresIntoCheckboxes(
                    p.languagesCategories,
                    this.state.form.first_language,
                    this.state.form.other_languages,
                    this.formValChange
                  )
                }
              </Col>
            </FormGroup>

            <FormGroup controlId="pr_number">
              <Col componentClass={ControlLabel} sm={3}>
                Permanent Residence Card Number (PR card)
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.pr_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="immigration_doc_number">
              <Col componentClass={ControlLabel} sm={3}>
                Immigration Document Number (if different from PR card):
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.immigration_doc_number}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="landing_date">
              <Col componentClass={ControlLabel} sm={3}>
                Landing Date
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.landing_date}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="arrival_date">
              <Col componentClass={ControlLabel} sm={3}>
                Arrival Date (if different from landing_date):
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.arrival_date}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>


            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button onClick={this.submit}>
                  Submit
                </Button>
              </Col>
            </FormGroup>
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
