import React, { Component } from 'react';
import _ from 'lodash';

import GeneralField from '../shared/GeneralField';
import SelectField from '../shared/SelectField';

// redux
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { createQuestion, updateQuestion } from '../../store/actions/questionActions.js'

import { Button, Form, FormGroup, Col, Row } from 'react-bootstrap';

class QuestionForm extends Component {
  constructor(props) {
    super(props);
    let question = {};
    if (this.props.match.params.id) {
      question = this.props.questionsById[this.props.match.params.id]
    }

    this.state = {
      questionId: question.id,
      mode: (question.id) ? 'edit' : 'new',
      form: {
        text: question.text || '',
        content_type: question.content_type || ''
      }
    }

    this.handleFormValChange = this.handleFormValChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormValChange(e, id=e.target.id) {
    let nextForm = {...this.state.form, [id]: e.target.value};
    this.setState({ form: nextForm });
  }

  handleSubmit() {
    if (this.state.mode === 'edit') {
      this.props.dispatch(updateQuestion(this.state.questionId, this.state.form));
    } else {
      this.props.dispatch(createQuestion(this.state.form));
    }
    this.props.history.push('/questions')
  }

  render() {
    const formTitle = (this.state.mode === 'edit') ?
      'Edit Question' : 'New Question'
    const contentTypeOptions = ['provider']

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>{formTitle}</h3>
          <hr />
        </Col>
        <Col sm={12}>
          <Form horizontal>
            <SelectField
              id="content_type"
              label="For"
              componentClass="select"
              value={this.state.form.content_type}
              options={contentTypeOptions}
              onChange={this.handleFormValChange}
              disabled={this.state.mode === 'edit'}
              required
            />
            <GeneralField
              id="text"
              label="Text"
              type="text"
              value={this.state.form.text}
              onChange={this.handleFormValChange}
              required
            />
            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button onClick={this.handleSubmit}>
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
    questionsById: state.questions.byId
  }
}

export default connect(mapStateToProps)(withRouter(QuestionForm));
