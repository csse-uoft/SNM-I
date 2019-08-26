import React, { Component } from 'react';
import _ from 'lodash';
import { providerFields, providerFormTypes } from '../../constants/provider_fields.js'
import { defaultProfileFields, defaultContactFields } from '../../constants/default_fields.js'
import { formatLocation } from '../../helpers/location_helpers'
import { newMultiSelectFieldValue } from '../../helpers/select_field_helpers'
import { defaultTimeSlot, defaultOperationHour, operationHourListToObject,
  operationHourObjectToList } from '../../helpers/operation_hour_helpers';

// redux
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { ACTION_SUCCESS } from '../../store/defaults.js';
import { createProvider, updateProvider } from '../../store/actions/providerActions.js'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { fetchProviderFields } from '../../store/actions/settingActions.js';

// components
import FieldGroup from '../shared/FieldGroup';
import OperationHoursFieldGroup from '../shared/OperationHoursFieldGroup';
import LocationFieldGroup from '../shared/LocationFieldGroup';
import FormWizard from '../shared/FormWizard';

// styles
import { Button, Form, Col, Row, Well, ListGroup, Label } from 'react-bootstrap';

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.addressChange = this.addressChange.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.state = {
      address:{
        street_address: '',
        apt_number: '',
        city: '',
        province: '',
        postal_code: ''
      }
    }
  }

  submitClick() {
    this.props.submitAddress(this.state.address);
  }

  addressChange(e) {
    let nextAddress = _.clone(this.state.address);
    nextAddress[e.target.id] = e.target.value;
    this.setState({ address: nextAddress });
  }

  render() {
    return (
      <Well>
        <LocationFieldGroup
          address={this.state.address}
          handleFormValChange={this.addressChange}
        />
        <Button onClick={this.submitClick}> Submit Address </Button>
      </Well>
    )
  }
}

class AddressListItem extends Component {
  constructor(props) {
    super(props);
    this.removeAddress = this.removeAddress.bind(this);
  }

  removeAddress() {
    this.props.removeOtherAddress(this.props.addressIndex)
  }

  render() {
    return (
        <li className="list-group-item" key={this.props.address.postal_code}>
          <h4>
            {"Alternate Address " + (this.props.addressIndex + 1).toString()}
            <Button bsStyle='link' onClick={this.removeAddress}>Remove</Button>
          </h4>
          {formatLocation(this.props.address)}
        </li>
    )
  }
}

class ProviderForm extends Component {
  constructor(props) {
    super(props);
    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    this.mainAddressChange = this.mainAddressChange.bind(this);
    this.operationHourChange = this.operationHourChange.bind(this);
    this.handleOperationHourOnClick = this.handleOperationHourOnClick.bind(this);
    this.otherAddressChange = this.otherAddressChange.bind(this);
    this.toggleAddressButton = this.toggleAddressButton.bind(this);
    this.submitAddress = this.submitAddress.bind(this);
    this.removeOtherAddress = this.removeOtherAddress.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    this.contactFieldsChange = this.contactFieldsChange.bind(this);

    const id = this.props.match.params.id;
    const provider = id ? this.props.providersById[id] : {};
    let providerType, providerCategory, formType;
    if (id) {
      if (provider.type === 'Organization') {
        formType = 'organization'
      } else {
        formType = provider.category.split(' ').join('_').toLowerCase()
      }
    }
    else {
      if (this.props.match.params.formType === 'organization') {
        providerType = 'Organization'
      } else {
        providerType = 'Individual'
        providerCategory = providerFormTypes[this.props.match.params.formType]
      }
    }

    let status;
    if (props.location.state && props.location.state.status) {
      status = props.location.state.status
    }
    this.state = {
      providerId: provider.id,
      mode: (provider.id) ? 'edit' : 'new',
      addressButtonClicked: false,
      formType: this.props.match.params.formType || formType,
      form : {
        type: provider.type || providerType,
        category: provider.category || providerCategory,
        languages: provider.languages || [],
        company: provider.company || '',
        profile: Object.assign(_.clone(defaultProfileFields), provider.profile),
        email: provider.email || '',
        primary_phone_number: provider.primary_phone_number || '',
        alt_phone_number: provider.alt_phone_number || '',
        primary_contact: Object.assign({
          profile: _.clone(defaultContactFields),
        }, provider.primary_contact),
        secondary_contact: Object.assign({
          profile: _.clone(defaultContactFields),
        }, provider.secondary_contact),
        main_address: Object.assign({
          street_address: '',
          apt_number: '',
          city: '',
          province: '',
          postal_code: ''
        }, provider.main_address),
        other_addresses: provider.other_addresses || [],
        operation_hours: Object.assign(
          defaultOperationHour,
          operationHourListToObject(provider.operation_hours)
        ),
        referrer: provider.referrer || '',
        own_car: provider.own_car || false,
        skills: provider.skills || '',
        visibility: provider.visibility || false,
        status: provider.status || status,
        notes: provider.notes || '',
        commitment: provider.commitment || '',
        start_date: provider.start_date || '',
        reference1_name: provider.reference1_name || '',
        reference1_phone: provider.reference1_phone || '',
        reference1_email: provider.reference1_email || '',
        reference2_name: provider.reference2_name || '',
        reference2_phone: provider.reference2_phone || '',
        reference2_email: provider.reference2_email || '',
        responses: provider.responses || []
      },
      currentStep: 1,
      responsesByQuestionId: _.keyBy(provider.responses, response => response.question_id)
    }
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('languages'));
    if (_.keys(this.props.formSetting).length === 0) {
      this.props.dispatch(fetchProviderFields());
    }
  }

  submitAddress(address) {
    let nextForm = _.clone(this.state.form);
    nextForm.other_addresses.push(address);
    this.setState({ form: nextForm, addressButtonClicked: false });
  }

  formValChange(e, id=e.target.id) {
    let nextForm = _.clone(this.state.form);
    if (_.includes(_.keys(defaultProfileFields), id) && this.state.form.type === 'Individual') {
      nextForm['profile'][id] = e.target.value;
    }
    else {
      nextForm[id] = e.target.value;
    }
    this.setState({ form: nextForm });
  }

  contactFieldsChange(e, prefix) {
    const id = e.target.id.split(':')[1]
    let nextForm = _.clone(this.state.form);
    nextForm[prefix]['profile'][id] = e.target.value;
    this.setState({ form: nextForm });
  }

  operationHourChange(e, weekDay, slotIndex, id) {
    let nextForm = _.clone(this.state.form);
    nextForm['operation_hours'][weekDay][slotIndex][id] = e && e.value;
    this.setState({ form: nextForm });
  }

  handleOperationHourOnClick(e, weekDay, action) {
    let nextForm = _.clone(this.state.form);

    if (action === 'add') {
      nextForm['operation_hours'][weekDay].push(_.clone(defaultTimeSlot))
    } else {
      nextForm['operation_hours'][weekDay].pop()
    }
    this.setState({ form: nextForm });
  }

  submit(e) {
    if (this.state.mode === 'edit') {
      const id = this.props.match.params.id;
      let form = _.clone(this.state.form);
      form['operation_hours'] = operationHourObjectToList(form['operation_hours'])
      this.props.dispatch(updateProvider(this.state.providerId, form, (status, err, id) => {
        if (status === ACTION_SUCCESS) {
          this.props.history.push('/provider/' + id)
        }
        else {
          console.log(err)
        }
      }))
        .then(() => this.props.history.push('/provider/' + id));
    } else {
      this.props.dispatch(createProvider(this.state.form, (status, err, id) => {
        if (status === ACTION_SUCCESS) {
          this.props.history.push('/provider/' + id)
        }
        else {
          console.log(err)
        }
      }))
    }
  }


  mainAddressChange(e) {
    let nextForm = _.clone(this.state.form);
    nextForm['main_address'][e.target.id] = e.target.value;
    this.setState({ form: nextForm });
  }

  otherAddressChange(e) {
    let nextForm = _.clone(this.state.form);
    const address_index = e.target.id.split('-')[0];
    const address_field = e.target.id.split('-')[1];
    nextForm['other_addresses'][address_index][address_field] = e.target.value;
    this.setState({ form: nextForm });
  }

  toggleAddressButton() {
    this.setState({ addressButtonClicked: !this.state.addressButtonClicked })
  }

  removeOtherAddress(index) {
    let nextForm = _.clone(this.state.form);
    nextForm['other_addresses'].splice(index, 1);
    this.setState({ form: nextForm });
  }

  handleResponseChange(e, questionId) {
    let nextForm = _.clone(this.state.form);
    const questionIndex = _.findIndex(nextForm.responses, response => {
      return response.question_id === questionId
    })

    if (questionIndex === -1) {
      nextForm.responses.push({
        text: e.target.value,
        question_id: questionId
      })
    } else {
      nextForm.responses[questionIndex].text = e.target.value;
    }
    this.setState({
      form: nextForm,
      responsesByQuestionId: _.keyBy(nextForm.responses, response => response.question_id)
    });
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

  render() {
    let addresses = this.state.form.other_addresses.map((address, index) =>
      <AddressListItem
        key={index}
        address={address}
        removeOtherAddress={this.removeOtherAddress}
        addressIndex={index}
      />
    )

    let formStructure, stepsOrder;
    formStructure = this.props.formSetting[this.state.formType] && this.props.formSetting[this.state.formType].form_structure
    stepsOrder = this.props.formSetting[this.state.formType] && this.props.formSetting[this.state.formType].steps_order

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{(this.state.mode === 'edit') ? 'Edit Provider Profile' : 'New Provider Profile'}</h3>
          <Label>{this.state.form.type}</Label>{' '}
          <Label>{this.state.form.category}</Label>
          <hr/>
        </Col>
        {this.state.formType && this.props.formSetting[this.state.formType] &&
          <FormWizard
            stepTitles={stepsOrder}
            currentStep={this.state.currentStep}
            handleStepClick={this.handleStepClick}
            prev={this.prev}
            next={this.next}
            submit={this.submit}
          >
            <Form horizontal>
              {_.map(formStructure[stepsOrder[this.state.currentStep - 1]], (data, fieldId) => {
                if (data.type === 'field') {
                  let options;
                  if (fieldId === 'languages') {
                    options = this.props.languagesCategories
                  }

                  if (fieldId === 'main_address') {
                    return (
                      <div key={fieldId}>
                        <h4>Main Addresses</h4>
                        <hr/>
                        <LocationFieldGroup
                          address={this.state.form.main_address}
                          handleFormValChange={this.mainAddressChange}
                        />
                        <hr/>
                      </div>
                    )
                  }
                  else if (fieldId === 'primary_contact' || fieldId === 'secondary_contact') {
                    return (
                      <div key={fieldId}>
                        <h4>{providerFields[fieldId]['label']}</h4>
                        <hr/>
                        {_.map(_.keys(defaultContactFields), contactField => {
                          return (
                            <FieldGroup
                              key={fieldId + ':' + contactField}
                              id={fieldId + ':' + contactField}
                              label={providerFields[contactField]['label']}
                              type={providerFields[contactField]['type']}
                              component={providerFields[contactField]['component']}
                              value={this.state.form[fieldId]['profile'][contactField]}
                              onChange={e => this.contactFieldsChange(e, fieldId)}
                            />
                          )
                        })}
                      </div>
                    )

                  }
                  else if (fieldId === 'other_addresses') {
                    return (
                      <div key={fieldId}>
                        <h4>Alternate Addresses</h4>
                        <hr/>
                        <ListGroup>
                          {addresses}
                        </ListGroup>
                        <Button onClick={this.toggleAddressButton}>
                          Add Alternate Address
                        </Button>
                        {this.state.addressButtonClicked &&
                          <AddressForm
                            addressIndex={this.state.form.other_addresses.length}
                            addressChange={this.otherAddressChange}
                            submitAddress={this.submitAddress}
                          />
                        }
                      </div>
                    )
                  }
                  else if (fieldId === 'availability') {
                    return (
                      <OperationHoursFieldGroup
                        key={fieldId}
                        operationHours={this.state.form.operation_hours}
                        handleFormValChange={this.operationHourChange}
                        handleOperationHourOnClick={this.handleOperationHourOnClick}
                      />
                    )
                  }
                  else if (_.includes(_.keys(defaultProfileFields), fieldId) &&
                    this.state.form.type === 'Individual') {
                    return (
                      <FieldGroup
                        key={fieldId}
                        id={fieldId}
                        label={providerFields[fieldId]['label']}
                        type={providerFields[fieldId]['type']}
                        component={providerFields[fieldId]['component']}
                        value={this.state.form['profile'][fieldId]}
                        onChange={providerFields[fieldId]['component'] === 'MultiSelectField'
                          ? this.handleMultiSelectChange
                          : this.formValChange}
                        required={data.required}
                        options={providerFields[fieldId]['options'] || options}
                      />
                    );
                  }
                  else {
                    return (
                      <FieldGroup
                        key={fieldId}
                        id={fieldId}
                        label={providerFields[fieldId]['label']}
                        type={providerFields[fieldId]['type']}
                        component={providerFields[fieldId]['component']}
                        value={this.state.form[fieldId]}
                        onChange={providerFields[fieldId]['component'] === 'MultiSelectField'
                          ? this.handleMultiSelectChange
                          : this.formValChange}
                        required={data.required}
                        options={providerFields[fieldId]['options'] || options}
                      />
                    );
                  }
                }
                else if (data.type === 'question'){
                  return (
                    <FieldGroup
                      key={fieldId}
                      id={data.id.toString()}
                      label={fieldId}
                      type="text"
                      component="GeneralField"
                      value={this.state.responsesByQuestionId[data.id] &&
                        this.state.responsesByQuestionId[data.id].text}
                      onChange={e => this.handleResponseChange(e, data.id)}
                      required={data.required}
                    />
                  )
                }
              })}
            </Form>
          </FormWizard>
        }
      </Row>
      );
    }
  }

const mapStateToProps = (state) => {
  return {
    providersById: state.providers.byId || {},
    providerLoaded: state.providers.indexLoaded,
    languagesCategories: state.ontology.languages.categories,
    categoriesLoaded: state.ontology.languages.loaded,
    formSetting: state.settings.providers || {}
  }
}
export default connect(mapStateToProps)(withRouter(ProviderForm));