import React, { Component } from 'react';
import { withRouter } from 'react-router';
import FormField from '../shared/FormField'
import SelectField from '../shared/SelectField'

import { needStatusOptions } from '../../store/defaults.js'

// redux
import { connect } from 'react-redux'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClientNeed, updateClientNeed } from '../../store/actions/needActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Radio } from 'react-bootstrap';

class NeedForm extends Component {
  constructor(props) {
    super(props);
    let need = {};

    if (this.props.match.params.need_id) {
      need = this.props.needsById[this.props.match.params.need_id]
    }

    this.state = {
      needId: need.id,
      mode: (need.id) ? 'edit' : 'new',
      form: {
        type: need.type || undefined,
        category: need.category || '',
        description: need.description || '',
        needed_by: need.needed_by || '',
        condition: need.condition || '',
        status: need.status || '',
        is_urgent: need.is_urgent || false
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('needs'));
  }

  formValChange(e, id=e.target.id, value=e.target.value) {
    let nextForm = {...this.state.form, [id]: value};
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      this.props.dispatch(updateClientNeed(this.props.clientId, this.state.needId, this.state.form));
    } else {
      this.props.dispatch(createClientNeed(this.props.clientId, this.state.form));
    }
    this.props.history.push(`/clients/${this.props.clientId}`)
  }

  render() {
    const p = this.props, s = this.state;
    const formTitle = (this.state.mode === 'edit') ? 'Edit Need' : 'Create Need'

    if (this.state.form.type === undefined) {
      return (
        <div className="outer">
          <div className="middle">
            <div className="need-type-buttons">
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
                <Col componentClass={ControlLabel} sm={3}>
                  Type
                </Col>
                <Col sm={9}>
                  <div className="need-type">
                    {this.state.form.type}
                  </div>
                </Col>
              </FormGroup>
              <FormGroup controlId="is_urgent">
                <Col componentClass={ControlLabel} sm={3}>
                  Urgent?
                </Col>
                <Col sm={9}>
                  <Radio
                    name="radioGroup"
                    value="1"
                    onChange={e => this.formValChange(e, 'is_urgent')}
                    defaultChecked={this.state.form.is_urgent === true}
                    inline
                  >
                    Yes
                  </Radio>{' '}
                  <Radio
                    name="radioGroup"
                    value="0"
                    onChange={e => this.formValChange(e, 'is_urgent')}
                    defaultChecked={this.state.form.is_urgent === false}
                    inline
                  >
                    No{this.state.form.is_urgent === false}
                  </Radio>{' '}
                </Col>
              </FormGroup>
              <SelectField
                id="category"
                label="Category"
                options={p.needsCategories}
                componentClass="select"
                value={this.state.form.category}
                onChange={this.formValChange}
                required
              />
              <FormField
                id="needed_by"
                label="Needed By"
                type="date"
                value={this.state.form.needed_by}
                onChange={this.formValChange}
              />
              <FormField
                id="description"
                label="Description"
                type="textarea"
                value={this.state.form.description}
                onChange={this.formValChange}
                componentClass="textarea"
                required
              />
              {this.state.form.type === 'Good' &&
                <FormField
                  id="condition"
                  label="Condition"
                  type="textarea"
                  value={this.state.form.condition}
                  onChange={this.formValChange}
                  componentClass="textarea"
                />
              }
              {s.mode === 'edit' &&
                <SelectField
                  id="status"
                  label="Status"
                  options={needStatusOptions}
                  componentClass="select"
                  value={this.state.form.status}
                  onChange={this.formValChange}
                  required
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
    needsById: state.needs.byId,
    clientId: state.needs.clientId,
    needsCategories: state.ontology.needs.categories,
    categoriesLoaded: state.ontology.needs.loaded
  }
}

export default connect(
  mapStateToProps
)(withRouter(NeedForm));
