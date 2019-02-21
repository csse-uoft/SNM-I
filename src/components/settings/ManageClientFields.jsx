import _ from 'lodash';
import React, { Component } from 'react';
import { clientFields } from '../../constants/client_fields.js'

// redux
import { connect } from 'react-redux';
import { fetchClientFields, updateClientFields } from '../../store/actions/settingActions.js';
import { ACTION_SUCCESS } from '../../store/defaults.js';

// components
import RadioField from '../shared/RadioField';

// styles
import { Grid, Row, Button, FormGroup, Form, Col, InputGroup, FormControl,
  Glyphicon } from 'react-bootstrap';

class ManageClientFields extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldToAdd: '',
      stepToAdd: '',
      selectedStep: '',
      form: {
        steps_order: props.stepsOrder,
        form_structure: props.formStructure,
        index_fields: props.indexFields
      }
    }

    this.handleFormValChange = this.handleFormValChange.bind(this);
    this.handleAddStepClick = this.handleAddStepClick.bind(this);
    this.handleAddFieldClick = this.handleAddFieldClick.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveFieldClick = this.handleRemoveFieldClick.bind(this);
    this.handleRemoveStepClick = this.handleRemoveStepClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchClientFields());
  }

  handleFormValChange(e, id=e.target.id) {
    this.setState({ [id]: e.target.value });
  }

  handleAddFieldClick(e, id=e.target.id) {
    let nextFormStructure = _.clone(this.state.form.form_structure);
    nextFormStructure[this.state.selectedStep][this.state.fieldToAdd] = false;
    this.setState({
      form: {
        ...this.state.form,
        form_structure: nextFormStructure },
      fieldToAdd: ''
    });
  }

  handleAddStepClick(e, id=e.target.id) {
    let nextFormStructure = _.clone(this.state.form.form_structure);
    let nextStepsOrder = _.clone(this.state.form.steps_order);
    nextFormStructure[this.state.stepToAdd] = {};
    nextStepsOrder.push(this.state.stepToAdd)

    this.setState({
      form: {
        ...this.state.form,
        form_structure: nextFormStructure,
        steps_order: nextStepsOrder
      },
      stepToAdd: ''
    });
  }

  handleRadioChange(e, id) {
    const step = _.findKey(this.state.form.form_structure, (fields, stepTitle) => {
      return _.includes(_.keys(fields), id)
    })
    this.setState({
      form: {
        ...this.state.form,
        form_structure: {
          ...this.state.form.form_structure,
          [step]: {
            ...this.state.form.form_structure[step],
            [id]: JSON.parse(e.target.value)
          }
        }
      }
    });
  }

  handleRemoveFieldClick(e, id, step) {
    let nextFormStructure = _.clone(this.state.form.form_structure);
    delete nextFormStructure[step][id];
    this.setState({
      form: {
        ...this.state.form,
        form_structure: nextFormStructure }
    });
  }

  handleRemoveStepClick(e, step) {
    let nextFormStructure = _.clone(this.state.form.form_structure);
    let nextStepsOrder = _.clone(this.state.form.steps_order);
    delete nextFormStructure[step];
    nextStepsOrder.splice(nextStepsOrder.indexOf(step), 1);
    this.setState({
      form: {
        ...this.state.form,
        form_structure: nextFormStructure,
        steps_order: nextStepsOrder
      }
    });
  }

  handleCheckboxChange(e, id) {
    let nextIndexFields = _.clone(this.state.form.index_fields);

    if (e.target.checked) {
      nextIndexFields.push(e.target.value)
    } else {
      _.remove(nextIndexFields, (value) => {
        return value === e.target.value;
      });
    }

    this.setState({
      form: {
        ...this.state.form,
        index_fields: nextIndexFields
      }
    });
  }

  handleSubmit() {
    this.props.dispatch(updateClientFields(this.state.form, status => {
      if (ACTION_SUCCESS) {
        this.props.history.push(`/dashboard`)
      }
    }));
  }

  render() {
    return(
      <Grid className="content">
        <Row>
          <Col sm={12}>
            <h3>Manage Client Fields</h3>
          </Col>
        </Row>
        <hr />
        <Form horizontal>
          <FormGroup controlId="stepToAdd">
            <Col sm={12}>
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.stepToAdd}
                  onChange={this.handleFormValChange}
                />
                <InputGroup.Button>
                  <Button
                    onClick={this.handleAddStepClick}
                    disabled={this.state.stepToAdd === ''}
                  >
                    Add step
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={12}>
              <InputGroup>
                <FormControl
                  componentClass="select"
                  value={this.state.selectedStep}
                  onChange={e => this.handleFormValChange(e, 'selectedStep')}
                >
                  <option value="select">-- Choose step --</option>
                  {_.map(this.state.form.steps_order, (step, index) => (
                    <option key={step} value={step}>
                      Step {index+1}: {step}
                    </option>)
                  )}
                </FormControl>
                <InputGroup.Button>
                </InputGroup.Button>
                <FormControl
                  componentClass="select"
                  value={this.state.fieldToAdd}
                  onChange={e => this.handleFormValChange(e, 'fieldToAdd')}
                >
                  <option value="select">-- Choose field --</option>
                  {_.map(clientFields, (props, field) => (
                    <option key={field} value={field}>
                      {props['label']}
                    </option>)
                  )}
                </FormControl>
                <InputGroup.Button>
                  <Button
                    onClick={this.handleAddFieldClick}
                    disabled={this.state.fieldToAdd === '' || this.state.selectedStep === ''}
                  >
                    Add field
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </FormGroup>
          {_.map(this.state.form.steps_order, (step, index) => (
            <div key={step}>
              <Row>
                <Col sm={1}>
                  <Button onClick={e => this.handleRemoveStepClick(e, step)} bsStyle="link">
                    <Glyphicon glyph="remove"/>
                  </Button>
                </Col>
                <Col sm={11}>
                  <FormGroup>
                    <Col sm={12}>
                      <h5>Step {index+1}: {step}</h5>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              {_.map(this.state.form.form_structure[step], (isRequired, field) => (
                <div key={field}>
                  <Row>
                    <Col sm={1}/>
                    <Col sm={2}>
                      <Button onClick={e => this.handleRemoveFieldClick(e, field, step)} bsStyle="link">
                        <Glyphicon glyph="remove"/>
                      </Button>
                    </Col>
                    <Col sm={9}>
                      <RadioField
                        id={field}
                        key={field}
                        label={clientFields[field]['label']}
                        onChange={e => this.handleRadioChange(e, field)}
                        options={{ 'Mandatory': true, 'Not mandatory': false }}
                        defaultChecked={this.state.form.form_structure[step][field]}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          ))}
          {/* {(_.keys(this.state.form.form_fields).length > 0) &&
            <CheckboxField
              id="index_fields"
              label="Client Table Fields"
              options={_.reduce(this.state.form.form_fields, (result, isRequired, field) => {
                result[titleize(field)] = field
                return result;
              }, {})}
              checkedOptions={this.state.form.index_fields}
              handleFormValChange={this.handleCheckboxChange}
            />
          } */}
        </Form>
        <Row>
          <FormGroup>
            <Col smOffset={3} sm={9}>
              <Button onClick={this.handleSubmit}>
                Submit
              </Button>
            </Col>
          </FormGroup>
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    stepsOrder: state.settings.clients.stepsOrder,
    formStructure: state.settings.clients.formStructure,
    indexFields: state.settings.clients.indexFields
  }
}

export default connect(mapStateToProps)(ManageClientFields);
