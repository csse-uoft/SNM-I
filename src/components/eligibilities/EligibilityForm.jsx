import React, { Component } from 'react';
import { withRouter } from 'react-router';
import FormField from '../shared/FormField'

// redux
import { connect } from 'react-redux'
import { createEligibility, updateEligibility } from '../../store/actions/eligibilityActions.js'

import { Button, Form, FormGroup, Col, Row } from 'react-bootstrap';

class EligibilityForm extends Component {
  constructor(props) {
    super(props);
    let eligibility = {};
    if (this.props.match.params.id) {
      eligibility = this.props.eligibilitiesById[this.props.match.params.id]
    }

    this.state = {
      eligibilityId: eligibility.id,
      mode: (eligibility.id) ? 'edit' : 'new',
      form: {
        title: eligibility.title || '',
      }
    }

    this.formValChange = this.formValChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  formValChange(e, id=e.target.id) {
    let nextForm = {...this.state.form, [id]: e.target.value};
    this.setState({ form: nextForm });
  }

  submit() {
    if (this.state.mode === 'edit') {
      this.props.dispatch(updateEligibility(this.state.eligibilityId, this.state.form));
    } else {
      this.props.dispatch(createEligibility(this.state.form));
    }
    this.props.history.push('/eligibility-criteria')
  }

  render() {
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Eligibility Criteria' :
      'Eligibility Criteria'
    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <FormField
              id="title"
              label="Title"
              type="text"
              value={this.state.form.title}
              onChange={this.formValChange}
              required
            />
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
    eligibilitiesById: state.eligibilities.byId
  }
}

export default connect(mapStateToProps)(withRouter(EligibilityForm));
