import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import GeneralField from '../shared/fields/GeneralField'
import SelectField from '../shared/fields/SelectField'
import MultiSelectField from '../shared/fields/MultiSelectField';
import { newMultiSelectFieldValue } from '../../helpers/select_field_helpers';

// redux
import { connect } from 'react-redux'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClientOutcome, updateClientOutcome } from '../../store/actions/outcomeActions.js'

import { Button, Form, FormGroup, FormLabel, Col, Row } from 'react-bootstrap';

class OutcomeForm extends Component {
  constructor(props) {
    super(props);
    let outcome = {};

    if (this.props.match.params.outcome_id) {
      outcome = this.props.outcomesById[this.props.match.params.outcome_id]
    }

    this.state = {
      outcomeId: outcome.id,
      mode: (outcome.id) ? 'edit' : 'new',
      form: {
        type: outcome.type || undefined,
        category: outcome.category || '',
        description: outcome.description || '',
        outcomeed_by: outcome.outcomeed_by || '',
        condition: outcome.condition || '',
        status: outcome.status || '',
        is_urgent: outcome.is_urgent || false,
        languages: outcome.languages || []
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('outcomes'));
  }

  formValChange(e, id=e.target.id, value=e.target.value) {
    let nextForm = {...this.state.form, [id]: value};
    this.setState({ form: nextForm });
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

  submit() {
    if (this.state.mode === 'edit') {
      this.props.dispatch(updateClientOutcome(this.props.clientId, this.state.outcomeId, this.state.form));
    } else {
      this.props.dispatch(createClientOutcome(this.props.clientId, this.state.form));
    }
    this.props.navigate(`/clients/${this.props.clientId}`)
  }

  render() {
    const p = this.props;
    const formTitle = (this.state.mode === 'edit') ? 'Edit Outcome' : 'Create Outcome'

    if (this.state.form.type === undefined) {
      return (
        <div className="outer">
          <div className="middle">
            <div className="outcome-type-buttons">
              <Button onClick={e => this.formValChange(e, 'type', 'Good')}>
                Goods
              </Button>
              <Button onClick={e => this.formValChange(e, 'type', 'Service')}>
                Service
              </Button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <Row className="content">
          <Col sm={12}>
            <h3>{formTitle}</h3>
            <hr />
          </Col>
          <Col sm={12}>
            <Form horizontal>
              <FormGroup controlId="type">
                <Col componentClass={FormLabel} sm={3}>
                  Type
                </Col>
                <Col sm={9}>
                  <div className="outcome-type">
                    {this.state.form.type}
                  </div>
                </Col>
              </FormGroup>
              <FormGroup controlId="is_urgent">
                <Col componentClass={FormLabel} sm={3}>
                  Urgent?
                </Col>
                <Col sm={9}>
                  <Form.Check
                    name="radioGroup"
                    value="1"
                    onChange={e => this.formValChange(e, 'is_urgent')}
                    defaultChecked={this.state.form.is_urgent === true}
                    type="radio"
                    inline
                  >
                    Yes
                  </Form.Check>{' '}
                  <Form.Check
                    name="radioGroup"
                    value="0"
                    onChange={e => this.formValChange(e, 'is_urgent')}
                    defaultChecked={this.state.form.is_urgent === false}
                    type="radio"
                    inline
                  >
                    No{this.state.form.is_urgent === false}
                  </Form.Check>{' '}
                </Col>
              </FormGroup>
              <SelectField
                label="Category"
                options={p.outcomesCategories}
                value={this.state.form.category}
                onChange={e => this.formValChange(e, 'category')}
                required = {true}
              />
              <GeneralField
                label="Outcomeed By"
                type="date"
                value={this.state.form.outcomeed_by}
                onChange={e => this.formValChange(e, 'outcomeed_by')}
              />
              <MultiSelectField
                label="Languages"
                options={p.languagesCategories}
                value={this.state.form.languages}
                onChange={e => this.handleMultiSelectChange(e, null, null)}
              />
              <GeneralField
                label="Description"
                value={this.state.form.description}
                onChange={e => this.formValChange(e, 'description')}
                required={true}
                multiline = {true}
                fullWidth = {true}
              />
              {this.state.form.type === 'Good' &&
                <GeneralField
                  label="Condition"
                  type="textarea"
                  value={this.state.form.condition}
                  onChange={e => this.formValChange(e, 'condition')}
                />
              }
              <FormGroup>
                <Col smOffset={3} sm={9}>
                  <Button onClick={this.submit}>
                    Submit
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    outcomesById: state.outcomes.byId,
    clientId: state.outcomes.clientId,
    outcomesCategories: state.ontology.outcomes.categories,
    languagesCategories: state.ontology.languages.categories,
    categoriesLoaded: state.ontology.outcomes.loaded
  }
}

export default connect(
  mapStateToProps
)(withRouter(OutcomeForm));
