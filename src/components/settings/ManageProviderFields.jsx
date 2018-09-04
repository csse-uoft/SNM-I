import _ from 'lodash';
import React, { Component } from 'react';
import { providerFields, providerFormTypes } from '../../constants/provider_fields.js'

// redux
import { connect } from 'react-redux';
import { fetchQuestions } from '../../store/actions/questionActions.js'
import { fetchProviderFields, updateProviderFields } from '../../store/actions/settingActions.js';
import { ACTION_SUCCESS, ACTION_ERROR } from '../../store/defaults.js';

// components
import RadioField from '../shared/RadioField'
import CheckboxField from '../shared/CheckboxField'
import FieldGroup from '../shared/FieldGroup'

// styles
import { Grid, Row, Button, FormGroup, Form, Col, InputGroup, FormControl,
  Glyphicon } from 'react-bootstrap';

class ManageProviderFields extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldToAdd: '',
      stepToAdd: '',
      selectedStep: '',
      formType: '',
      form: props.providerSetting
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
    this.props.dispatch(fetchQuestions());
    this.props.dispatch(fetchProviderFields());
  }

  handleFormValChange(e, id=e.target.id) {
    if (id === 'formType' && !this.state.form[e.target.value]) {
      this.setState({
        [id]: e.target.value,
        form: {
          ...this.state.form,
          [e.target.value]: {
            steps_order: [],
            form_structure: {},
          }
        }
      });
    }
    else {
      this.setState({ [id]: e.target.value });
    }
  }

  handleAddFieldClick(e, id=e.target.id) {
    let nextFormStructure = _.clone(this.state.form[this.state.formType].form_structure);
    const question = _.find(this.props.questions, question => {
      return this.state.fieldToAdd === question.text
    })

    if (question) {
      nextFormStructure[this.state.selectedStep][this.state.fieldToAdd] = {
        type: 'question',
        id: question.id,
        required: false
      };
    }
    else {
      nextFormStructure[this.state.selectedStep][this.state.fieldToAdd] = {
        type: 'field',
        required: false
      };
    }

    this.setState({
      form: {
        ...this.state.form,
        [this.state.formType]: {
          ...this.state.form[this.state.formType],
          form_structure: nextFormStructure
        }
      },
      fieldToAdd: ''
    });
  }

  handleAddStepClick(e, id=e.target.id) {
    let nextFormStructure = _.clone(this.state.form[this.state.formType].form_structure);
    let nextStepsOrder = _.clone(this.state.form[this.state.formType].steps_order);
    nextFormStructure[this.state.stepToAdd] = {};
    nextStepsOrder.push(this.state.stepToAdd)

    this.setState({
      form: {
        ...this.state.form,
        [this.state.formType]: {
          ...this.state.form[this.state.formType],
          form_structure: nextFormStructure,
          steps_order: nextStepsOrder
        }
      },
      stepToAdd: ''
    });
  }

  handleRadioChange(e, id) {
    const step = _.findKey(this.state.form[this.state.formType].form_structure, (fields, stepTitle) => {
      return _.includes(_.keys(fields), id)
    })
    this.setState({
      form: {
        ...this.state.form,
        [this.state.formType]: {
          ...this.state.form[this.state.formType],
          form_structure: {
            ...this.state.form.form_structure,
            [step]: {
              ...this.state.form.form_structure[step],
              [id]: {
                ...this.state.form.form_structure[step][id],
                required: JSON.parse(e.target.value)
              }
            }
          }
        }
      }
    });
  }

  handleRemoveFieldClick(e, id, step) {
    let nextFormStructure = _.clone(this.state.form[this.state.formType].form_structure);
    delete nextFormStructure[step][id];
    this.setState({
      form: {
        ...this.state.form,
        [this.state.formType]: {
          ...this.state.form[this.state.formType],
          form_structure: nextFormStructure
        }
      }
    })
  }

  handleRemoveStepClick(e, step) {
    let nextFormStructure = _.clone(this.state.form[this.state.formType].form_structure);
    let nextStepsOrder = _.clone(this.state.form[this.state.formType].steps_order);
    delete nextFormStructure[step];
    nextStepsOrder.splice(nextStepsOrder.indexOf(step), 1);
    this.setState({
      form: {
        ...this.state.form,
        [this.state.formType]: {
          ...this.state.form[this.state.formType],
          form_structure: nextFormStructure,
          steps_order: nextStepsOrder
        }
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
    this.props.dispatch(updateProviderFields(this.state.form, status => {
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
            <h3>Manage Provider Fields</h3>
          </Col>
        </Row>
        <hr />
        <Form horizontal>
          <FieldGroup
            id="formType"
            label="Please select provide form type: "
            component="SelectField"
            value={this.state.formType}
            onChange={this.handleFormValChange}
            options={providerFormTypes}
          />
          {this.state.formType.length > 0 &&
            <div>
              <FormGroup controlId='stepToAdd'>
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
                      {_.map(this.state.form[this.state.formType].steps_order, (step, index) => (
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
                      <optgroup label="Fields" >
                        {_.map(providerFields, (props, field) => (
                          <option key={field} value={field}>
                            {props['label']}
                          </option>)
                        )}
                      </optgroup>
                      {this.props.questions && this.props.questions.length > 0 &&
                        <optgroup label="Questions">
                          {_.map(this.props.questions, question => (
                            <option key={question.id} value={question.text}>
                              {question.text}
                            </option>)
                          )}
                        </optgroup>
                      }
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
              {_.map(this.state.form[this.state.formType].steps_order, (step, index) => (
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
                  {_.map(this.state.form[this.state.formType].form_structure[step], (data, field) => (
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
                            label={(providerFields[field] && providerFields[field]['label']) || field}
                            onChange={e => this.handleRadioChange(e, field)}
                            options={{ 'Mandatory': true, 'Not mandatory': false }}
                            defaultChecked={data.required}
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
              ))}
              <Row>
                <FormGroup>
                  <Col smOffset={3} sm={9}>
                    <Button onClick={this.handleSubmit}>
                      Submit
                    </Button>
                  </Col>
                </FormGroup>
              </Row>
            </div>
          }
        </Form>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  const questions = _.filter(state.questions.byId, question => {
    return question.content_type === 'provider'
  });
  return {
    questions: questions,
    providerSetting: state.settings.providers
  }
}

export default connect(mapStateToProps)(ManageProviderFields);
