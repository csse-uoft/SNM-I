import _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ACTION_SUCCESS, ACTION_ERROR } from '../../store/defaults.js';
import { clientFields } from '../../constants/client_fields.js'

// redux
import { connect } from 'react-redux';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClient, updateClient } from '../../store/actions/clientActions.js';
import { fetchEligibilities } from '../../store/actions/eligibilityActions.js';
import { fetchClientFields } from '../../store/actions/settingActions.js';

// components
import LocationFieldGroup from './client_form/LocationFieldGroup';
import FamilyFields from './client_form/FamilyFields';
import FormWizard from './client_form/FormWizard';
import FieldGroup from '../shared/FieldGroup';

// styles
import { Grid, Button, Form, Col, Row } from 'react-bootstrap';

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
      form: Object.assign({
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
        }, client.address),
        country_of_origin: '',
        country_of_last_residence: '',
        first_language: '',
        other_languages: [],
        pr_number: '',
        immigration_doc_number: '',
        landing_date: '',
        arrival_date: '',
        status_in_canada: '',
        income_source: '',
        current_education_level: '',
        completed_education_level: '',
        num_of_dependants: '',
        file_id: '',
        family: Object.assign({
          members: []
        }, client.family),
        eligibilities: []
      }, _.omit(client, ['address', 'family']))
    }

    this.formValChange = this.formValChange.bind(this);
    this.handleFamilyChange = this.handleFamilyChange.bind(this);
    this.submit = this.submit.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleAddFamilyButtonClick = this.handleAddFamilyButtonClick.bind(this);
    this.handleRemoveFamilyButtonClick = this.handleRemoveFamilyButtonClick.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
    this.props.dispatch(fetchEligibilities());
    if (this.props.stepsOrder.length == 0) {
      this.props.dispatch(fetchClientFields());
    }
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
    const addressFields = [
      'street_address',
      'apt_number',
      'city',
      'province',
      'postal_code'
    ]
    if (id === 'other_languages' || id === 'eligibilities') {
      if (e.target.checked) {
        nextForm[id].push(e.target.value)
      } else {
        _.remove(nextForm[id], (value) => {
          return value === e.target.value
        });
      }
    }
    else if (_.includes(addressFields, id)) {
      nextForm['address'][e.target.id] = e.target.value;
    }
    else {
      nextForm[id] = e.target.value
    }
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      this.props.dispatch(
        updateClient(this.state.clientId, this.state.form, (status, err, clientId) => {
          if (status === ACTION_SUCCESS) {
            this.props.history.push(`/clients/${clientId}`)
          } else {
            this.setState({ showAlert: true });
          }
        })
      );
    } else {
      this.props.dispatch(
        createClient(this.state.form, (status, err, clientId) => {
        if (status === ACTION_SUCCESS) {
          this.props.history.push(`/clients/${clientId}`)
        } else {
          const error_messages =
            _.reduce(JSON.parse(err.message), (result, error_messages, field) => {
              const titleizedField = (field.charAt(0).toUpperCase() + field.slice(1))
                .split('_').join(' ')
              _.each(error_messages, message => {
                result.push(message.replace('This field', titleizedField))
              })
              return result;
            }, [])
          this.setState({ showAlert: true, error_messages: error_messages });
        }
      }));
    }
  }

  handleAddFamilyButtonClick() {
    let nextForm = _.clone(this.state.form);
    nextForm['family']['members'].push({
      'person': {
        'first_name': '',
        'last_name': '',
        'birth_date': '',
        'gender': ''
      },
      'relationship': ''
    })
    this.setState({ form: nextForm });
  }

  handleRemoveFamilyButtonClick(index) {
    let nextForm = _.clone(this.state.form);
    nextForm['family']['members'].splice(index, 1);
    this.setState({ form: nextForm });
  }

  handleFamilyChange(e, index) {
    const id = e.target.id;
    let nextForm = _.clone(this.state.form);
    if (id === 'relationship') {
      nextForm['family']['members'][index][id] = e.target.value;
    }
    else {
      nextForm['family']['members'][index]['person'][id] = e.target.value;
    }
    this.setState({ form: nextForm });
  }

  render() {
    const p = this.props;
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Client Profile' : 'New Client Profile'

    return (
      <Grid className="content">
        <Row>
          <Col sm={12}>
            <h3>{formTitle}</h3>
          </Col>
          <FormWizard
            stepTitles={this.props.stepsOrder}
            currentStep={this.state.currentStep}
            handleStepClick={this.handleStepClick}
          />
          {this.state.showAlert &&
            <Col sm={12} className="flash-error">
              {_.map(this.state.error_messages, (message, index) => {
                return (
                  <li key={index}>
                    {message}
                  </li>
                );
              })}
            </Col>
          }
        </Row>
        <Form horizontal>
          {_.map(this.props.formStructure[this.props.stepsOrder[this.state.currentStep - 1]], (isRequired, fieldId) => {
            let options;
            if (fieldId === 'first_language') {
              options = this.props.languagesCategories;
            }
            else if (fieldId === 'other_languages') {
              options = this.props.languagesCategories.filter(
                category => category !== this.state.form.first_language)
            }
            else if (fieldId === 'eligibilities') {
              options = this.props.eligibilities;
            }

            if (fieldId === 'address') {
              return (
                <LocationFieldGroup
                  key="address"
                  address={this.state.form.address}
                  handleFormValChange={this.formValChange}
                />
              )
            }
            else if (fieldId === 'family') {
              return (
                <FamilyFields
                  key="family"
                  family={this.state.form.family}
                  clientId={this.state.clientId}
                  handleFormValChange={this.handleFamilyChange}
                  handleAddFamilyButtonClick={this.handleAddFamilyButtonClick}
                  handleRemoveFamilyButtonClick={this.handleRemoveFamilyButtonClick}
                />
              )
            }
            else {
              return (
                <FieldGroup
                  key={fieldId}
                  id={fieldId}
                  label={clientFields[fieldId]['label']}
                  type={clientFields[fieldId]['type']}
                  component={clientFields[fieldId]['component']}
                  value={this.state.form[fieldId]}
                  onChange={this.formValChange}
                  required={isRequired}
                  options={clientFields[fieldId]['options'] || options}
                />
              );
            }
          })}


          <Row>
            {this.state.currentStep > 1 &&
              <Button className="previous-button" onClick={this.prev}>
                Previous
              </Button>
            }
            {(this.state.currentStep < this.props.stepsOrder.length) ? (
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
    eligibilities: _.map(state.eligibilities.byId, eligibility => eligibility['title']),
    stepsOrder: state.settings.stepsOrder,
    formStructure: state.settings.formStructure,
  }
}

export default connect(mapStateToProps)(withRouter(ClientForm));
