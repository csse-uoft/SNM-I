import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClientNeed, updateClientNeed } from '../../store/actions/needActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

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
        category: need.category || '',
        description: need.description || '',
        needed_by: need.needed_by || '',
        condition: need.condition || '',
        status: need.status || ''
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchOntologyCategories('needs'));
  }

  formValChange(e) {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      this.props.dispatch(updateClientNeed(this.props.clientId, this.state.needId, this.state.form));
    } else {
      this.props.dispatch(createClientNeed(this.props.clientId, this.state.form));
    }
    this.props.history.push(`/client/${this.props.clientId}`)
  }

  render() {
    const p = this.props;
    const formTitle = (this.state.mode === 'edit') ? 'Edit Need' : 'Create Need'

    function cateogiresIntoOptions(categories) {
      return categories.map((category) => {
        return <option key={category} value={ category }>{category}</option>
      })
    }

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="category">
              <Col componentClass={ControlLabel} sm={3}>
                Category
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.form.category}
                  onChange={this.formValChange}
                >
                  <option value="select">-- Not Set --</option>
                  { p.categoriesLoaded &&
                    cateogiresIntoOptions(p.needsCategories)
                  }
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="needed_by">
              <Col componentClass={ControlLabel} sm={3}>
                Needed by
              </Col>
              <Col sm={9}>
                <FormControl type="date" value={this.state.form.needed_by} onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="description">
              <Col componentClass={ControlLabel} sm={3}>
                Description
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="textarea"
                  value={this.state.form.description}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="condition">
              <Col componentClass={ControlLabel} sm={3}>
                Condition
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="textarea"
                  value={this.state.form.condition}
                  onChange={this.formValChange}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="status">
              <Col componentClass={ControlLabel} sm={3}>
                Status
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.status} onChange={this.formValChange} />
              </Col>
            </FormGroup>

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
