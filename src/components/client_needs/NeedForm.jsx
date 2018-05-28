import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { connect } from 'react-redux'
import { fetchOntologyCategories } from '../../store/actions/ontologyActions.js';
import { createClientNeed } from '../../store/actions/needActions.js'

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';

class NeedForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        category: '',
        description: '',
        needed_by: '',
        condition: '',
        status: ''
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
    const clientId = this.props.match.params.id
    this.props.dispatch(createClientNeed(clientId, this.state.form));
    this.props.history.push(`/client/${clientId}`)
  }

  render() {
    const p = this.props;

    function cateogiresIntoOptions(categories) {
      return categories.map((category) => {
        return <option key={category} value={ category }>{category}</option>
      })
    }

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>New Need</h3>
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
                  { p.categories_loaded &&
                    cateogiresIntoOptions(p.needs_categories)
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
    needs_categories: state.ontology.needs.categories,
    categories_loaded: state.ontology.needs.loaded
  }
}

export default connect(
  mapStateToProps
)(withRouter(NeedForm));
