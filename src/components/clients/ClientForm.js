import _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ACTION_SUCCESS } from '../../store/defaults.js';
import { clientFields } from '../../constants/client_fields.js'
import { defaultProfileFields, defaultLocationFields } from '../../constants/default_fields.js'
import { newMultiSelectFieldValue } from '../../helpers/select_field_helpers'

// redux
import { connect } from 'react-redux';
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClient, updateClient } from '../../store/actions/clientActions.js';
import { fetchEligibilities } from '../../store/actions/eligibilityActions.js';
import { fetchClientFields } from '../../store/actions/settingActions.js';

// components
import LocationFieldGroup from '../shared/LocationFieldGroup';
import FamilyFields from './client_form/FamilyFields';
import FormWizard from '../shared/FormWizard';
import FieldGroup from '../shared/FieldGroup';

// styles
import { Grid, Form, Col, Row } from 'react-bootstrap';

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
        profile: Object.assign(_.clone(defaultProfileFields), client.profile),
        address: Object.assign(_.clone(defaultLocationFields), client.address),
        marital_status: '',
        has_children: false,
        num_of_children: '',
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
      }, _.omit(client, ['address', 'family', 'profile']))
    }

    this.formValChange = this.formValChange.bind(this);
    this.handleFamilyChange = this.handleFamilyChange.bind(this);
    this.submit = this.submit.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleAddFamilyButtonClick = this.handleAddFamilyButtonClick.bind(this);
    this.handleRemoveFamilyButtonClick = this.handleRemoveFamilyButtonClick.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
    this.props.dispatch(fetchEligibilities());
    if (this.props.stepsOrder.length === 0) {
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

  handleMultiSelectChange(id, selectedOption, actionMeta) {
    const preValue = this.state.form[id]
    const newValue = newMultiSelectFieldValue(preValue, selectedOption, actionMeta)

    this.setState({
      form: {
        ...this.state.form,
        [id]: newValue
      }
    });
  }

  formValChange(e, id=e.target.id) {
    let nextForm = _.clone(this.state.form);
    const addressFields = _.keys(defaultLocationFields);
    
    if (id === 'eligibilities') {
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
    else if (_.includes(_.keys(defaultProfileFields), id)) {
      nextForm['profile'][e.target.id] = e.target.value;
    }
    else {
      nextForm[id] = e.target.value
    }
    this.setState({ form: nextForm });
  }

  submit(e) {
    console.log("submit e", e);
    console.log("submit this.state.mode", this.state.mode);
    
    if (this.state.mode === 'edit') {
      console.log("edit");
      
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
      console.log("else: this.state.form", this.state.form);
      
      if (!verifyForm(this.state.form)){
        // TODO: when expanding verification not only on postal code in the future, make sure
        // change the error message to dynamic
        let error_messages = []
        error_messages.push("Postal Code: Invalid postal code!")
        this.setState({ showAlert: true, error_messages: error_messages});
      } else {
        this.props.dispatch(
        createClient(this.state.form, (status, err, clientId) => {
        
        console.log("else: status, err, clientId", status, err, clientId)
        
        if (status === ACTION_SUCCESS) {
          //this.props.history.push(`/clients/${clientId}`) 
           this.props.history.push('/clients/' + clientId)
        } else {
          const error_messages =
            _.reduce(JSON.parse(err.message), (result, errorMessages, field) => {
              _.each(errorMessages, function(message, key) {
                let splitKeys = key.split('_')
                splitKeys = splitKeys.map(key => key.charAt(0)
                .toUpperCase() + key.slice(1))
                const titleizedKey = splitKeys.join(' ')
                result.push(titleizedKey + ": " + message)
              })
              return result;
            }, [])
          this.setState({ showAlert: true, error_messages: error_messages });
          }
        }));
      }
      
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
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Client Profile' : 'New Client Profile'

    return (
      <Grid className="content">
        <Row>
          <Col sm={12}>
            <h3>{formTitle}</h3>
          </Col>
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
        <FormWizard
          stepTitles={this.props.stepsOrder}
          currentStep={this.state.currentStep}
          handleStepClick={this.handleStepClick}
          prev={this.prev}
          next={this.next}
          submit={this.submit}
        >
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
              else if (_.includes(_.keys(defaultProfileFields), fieldId)) {
                return (
                  <FieldGroup
                    key={fieldId}
                    id={fieldId}
                    label={clientFields[fieldId]['label']}
                    type={clientFields[fieldId]['type']}
                    component={clientFields[fieldId]['component']}
                    value={this.state.form.profile[fieldId]}
                    onChange={clientFields[fieldId]['component'] === 'MultiSelectField'
                      ? this.handleMultiSelectChange
                      : this.formValChange}
                    required={isRequired}
                    options={clientFields[fieldId]['options'] || options}
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
                    onChange={clientFields[fieldId]['component'] === 'MultiSelectField'
                      ? this.handleMultiSelectChange
                      : this.formValChange}
                    required={isRequired}
                    options={clientFields[fieldId]['options'] || options}
                  />
                );
              }
            })}
          </Form>
        </FormWizard>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    clientsById: state.clients.byId,
    languagesCategories: state.ontology.languages.categories,
    eligibilities: _.map(state.eligibilities.byId, eligibility => eligibility['title']),
    stepsOrder: state.settings.clients.stepsOrder,
    formStructure: state.settings.clients.formStructure,
  }
}

// Verify the params filled in client form
function verifyForm(form){
  let is_postal_code_valid = false;
  if (!form.address.postal_code){
    return true;
  } else {
    const postal_code_regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    is_postal_code_valid = postal_code_regex.test(form.address.postal_code);
  }
  return is_postal_code_valid;
}

export default connect(mapStateToProps)(withRouter(ClientForm));
