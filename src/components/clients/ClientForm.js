import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

// redux
import { connect } from 'react-redux';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClient, updateClient } from '../../store/actions/clientActions.js';

import { Grid, Button, Form, FormGroup, FormControl, ControlLabel, Col, Row,
  Radio } from 'react-bootstrap';

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
        first_name: client.first_name || '',
        middle_name: client.middle_name || '',
        last_name: client.last_name || '',
        preferred_name: client.preferred_name || '',
        gender: client.gender,
        birth_date: client.birth_date || '',
        email: client.email || '',
        primary_phone_number: client.primary_phone_number || '',
        alt_phone_number: client.alt_phone_number || '',
        marital_status: client.marital_status || '',
        address: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, client.address),
        has_children: client.has_children || false,
        num_of_children: client.num_of_children || '',
        country_of_origin: client.country_of_origin || '',
        country_of_last_residence: client.country_of_last_residence || '',
        first_language: client.first_language || '',
        other_languages: client.other_languages || '',
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
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
  }

  formValChange(e, id=e.target.id) {
    let nextForm = _.clone(this.state.form);
    if (id === 'marital_status' && (e.target.value === 'Married' || e.target.value === 'Common Law')) {
      nextForm[id] = e.target.value
      nextForm['family']['spouse'] = {
        'full_name': '',
        'birth_date': '',
        'gender': ''
      }
    }
    else if (id === 'num_of_children') {
      nextForm[id] = e.target.value
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
    else if (id === 'file_id') {
      nextForm['family']['file_id'] = e.target.value
    }
    else {
      nextForm[id] = e.target.value
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
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Client Profile' : 'New Client Profile'

    function cateogiresIntoOptions(categories) {
      return categories.map((category) => {
        return <option key={category} value={category}>{category}</option>
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
          <Row>
            <Col sm={12}>
              <h4>Personal Information</h4>
              <hr />
            </Col>
            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.first_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="middle_name">
              <Col componentClass={ControlLabel} sm={3}>
                Middle name
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.middle_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={this.state.form.last_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="preferred_name">
              <Col componentClass={ControlLabel} sm={3}>
                Preferred Name
              </Col>
              <Col sm={9}>
                <FormControl type="text"
                  value={this.state.form.preferred_name}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="gender">
              <Col componentClass={ControlLabel} sm={3}>
                Gender
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.gender}
                  onChange={this.formValChange}
                >
                  <option value="select">--- Not Set ---</option>
                  <option value="Other">Other</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="birth_date">
              <Col componentClass={ControlLabel} sm={3}>
                Date of Birth
              </Col>
              <Col sm={9}>
                <FormControl
                  type="date"
                  value={this.state.form.birth_date}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

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
          <Row>
            <Col sm={12}>
              <h4>Family</h4>
              <hr/>
            </Col>
            {(JSON.parse(this.state.form.has_children) ||
              this.state.form.marital_status === 'Married' ||
              this.state.form.marital_status === 'Common Law') && (
              <FormGroup controlId="file_id">
                <Col componentClass={ControlLabel} sm={3}>
                  File ID
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="text"
                    value={this.state.form.family.file_id}
                    onChange={this.formValChange}
                  />
                </Col>
              </FormGroup>
            )}
            <FormGroup controlId="marital_status">
              <Col componentClass={ControlLabel} sm={3}>
                Marital Status
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.marital_status}
                  onChange={this.formValChange}
                >
                  <option value="select">--- Not Set ---</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Common Law">Common Law</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </FormControl>
              </Col>
            </FormGroup>

            {(this.state.form.marital_status === 'Married' ||
              this.state.form.marital_status === 'Common Law') && (
              <div>
                <FormGroup controlId="full_name">
                  <Col componentClass={ControlLabel} sm={3}>
                    Spouse
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      type="text"
                      value={this.state.form.family.spouse.full_name}
                      onChange={this.spouseChange}
                      placeholder="Full name"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="birth_date">
                  <Col componentClass={ControlLabel} sm={3}>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      type="date"
                      value={this.state.form.family.spouse.birth_date}
                      onChange={this.spouseChange}
                      placeholder="Birth date"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="gender">
                  <Col componentClass={ControlLabel} sm={3}>
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      value={this.state.form.family.spouse.gender}
                      onChange={this.spouseChange}
                    >
                      <option value="select">--- Gender ---</option>
                      <option value="Other">Other</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </FormControl>
                  </Col>
                </FormGroup>
              </div>
            )}

            <FormGroup controlId="has_children">
              <Col componentClass={ControlLabel} sm={3}>
                Do you have children?
              </Col>
              <Col sm={9}>
                <Radio
                  name="radioGroup"
                  value='true'
                  onChange={e => this.formValChange(e, 'has_children')}
                  defaultChecked={this.state.form.has_children === true}
                  inline
                >
                  Yes
                </Radio>{' '}
                <Radio
                  name="radioGroup"
                  value='false'
                  onChange={e => this.formValChange(e, 'has_children')}
                  defaultChecked={this.state.form.has_children === false}
                  inline
                >
                  No
                </Radio>{' '}
              </Col>
            </FormGroup>

            {JSON.parse(this.state.form.has_children) && (
              <FormGroup controlId="num_of_children">
                <Col componentClass={ControlLabel} sm={3}>
                  Number of Children
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="number"
                    value={this.state.form.num_of_children}
                    onChange={this.formValChange}
                  />
                </Col>
              </FormGroup>
            )}
            {(this.state.form.num_of_children > 0) && (
              <div>
                {[...Array(parseInt(this.state.form.num_of_children))].map((object, i) => {
                  return (
                    <div key={i}>
                      <FormGroup controlId="full_name">
                        <Col componentClass={ControlLabel} sm={3}>
                          Children #{i+1}
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="text"
                            value={this.state.form.family.children[i].full_name}
                            onChange={e => this.childChange(e, i)}
                            placeholder="Full name"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="birth_date">
                        <Col componentClass={ControlLabel} sm={3}>
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="date"
                            value={this.state.form.family.children[i].birth_date}
                            onChange={e => this.childChange(e, i)}
                            placeholder="Birth date"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="gender">
                        <Col componentClass={ControlLabel} sm={3}>
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            componentClass="select"
                            placeholder="select"
                            value={this.state.form.family.children[i].gender}
                            onChange={e => this.childChange(e, i)}
                          >
                            <option value="select">--- Gender ---</option>
                            <option value="Other">Other</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </div>
                  )})
                }
              </div>
            )}
          </Row>

          <br/>
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
                <FormControl
                  type="text"
                  value={this.state.form.other_languages}
                  onChange={this.formValChange}
                />
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
