import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import DeleteModal from './shared/DeleteModal';
import NeedGroupPanel from './client_needs/NeedGroupPanel';

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
    const needGroups = p.needGroups.map(need_group =>
      <NeedGroupPanel
        key={need_group.id}
        needGroup={need_group.category}
        needs={need_group.needs}
        needGroupId={need_group.id}
        status={need_group.status}
        clientId={clientId}
        handleShow={this.handleShow}
        needsOrder={p.needsOrder}
      />
    );

    return (
      <div className="client-needs">
        <h3>Needs</h3>
        <Link to={`/clients/${clientId}/needs/new`}>
          <Button bsStyle="default">
            Add need
          </Button>
        </Link>
        <hr/>
        {needGroups}
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
