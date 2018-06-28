import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NeedsIndex from './client_needs/NeedsIndex'
import DeleteModal from './shared/DeleteModal'

import { Button } from 'react-bootstrap';

// redux
import { connect } from 'react-redux'
import { deleteClientNeed, ERROR } from '../store/actions/needActions.js'

import '../stylesheets/ClientNeeds.css';

class ClientNeeds extends Component {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      show: false,
      objectId: null
    };
  }

  handleHide() {
    this.setState({ show: false });
  }

  handleShow(id) {
    this.setState({
      show: true,
      objectId: id
    })
  }

  handleDelete(id, form) {
    const clientId = this.props.clientId;
    this.props.dispatch(deleteClientNeed(clientId, id, form)).then((status) => {
      if (status === ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ show: false })
      }
    });
  }

  render() {
    const p = this.props,
          clientId = p.clientId;
    return (
      <div>
        <h3>Needs</h3>
        <Link to={`/clients/${clientId}/needs/new`}>
          <Button bsStyle="default">
            Add need
          </Button>
        </Link>
        <hr />
        <NeedsIndex
          needs={p.needs}
          clientId={p.clientId}
          handleShow={this.handleShow}
        />
        <DeleteModal
          contentType='Need'
          objectId={this.state.objectId}
          show={this.state.show}
          onHide={this.handleHide}
          delete={this.handleDelete}
        />
      </div>
    )
  }
}

export default connect()(ClientNeeds);
