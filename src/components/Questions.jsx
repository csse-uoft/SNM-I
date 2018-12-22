import _ from 'lodash';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'

import QuestionsIndex from './questions/QuestionsIndex'
import QuestionRow from './questions/QuestionRow'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchQuestions, deleteQuestion } from '../store/actions/questionActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Questions extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      deleteModalShow: false,
      objectId: null,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchQuestions());
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalShow: false });
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
  }

  handleDelete(id, form) {
    this.props.dispatch(
      deleteQuestion(id, form, status => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ deleteModalShow: false });
        }
      })
    );
  }

  render() {
    const p = this.props;
    return(
      <div className="content">
        <div>
          <h1>Questions</h1>
          <Link to="/questions/new">
            <Button bsStyle="default">
              Create new question
            </Button>
          </Link>
          <hr/>
          {p.questionsLoaded &&
            <QuestionsIndex>{
              _.map(p.questionsById, (question) => {
                return (
                  <QuestionRow
                    key={question.id}
                    question={question}
                    handleShow={this.handleDeleteModalShow}
                  />
                );
              })
            }</QuestionsIndex>
          }
          <DeleteModal
            contentType="Question"
            objectId={this.state.objectId}
            show={this.state.deleteModalShow}
            onHide={this.handleDeleteModalHide}
            delete={this.handleDelete}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    questionsById: state.questions.byId,
    questionsLoaded: state.questions.questionsLoaded
  }
}

export default connect(
  mapStateToProps
)(Questions);
