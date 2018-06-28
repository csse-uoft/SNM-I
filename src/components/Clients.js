import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ClientsIndex from './clients/ClientsIndex'
import ClientRow from './clients/ClientRow'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchClients, createClients, deleteClient, CLIENT_ERROR } from '../store/actions/clientActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Clients extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null
    };
  }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(createClients(file)).then((status) => {
      if (status === CLIENT_ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ CSVModalshow: false })
      }
    });
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalshow: false });
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
  }

  handleDelete(id, form) {
    this.props.dispatch(deleteClient(id, form)).then((status) => {
      if (status === CLIENT_ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ deleteModalShow: false })
      }
    });
  }

  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  render() {
    const p = this.props;
    return(
      <div className='clients-table content modal-container'>
        <div>
          <h1>Clients</h1>
          <Link to='/clients/new'>
            <Button bsStyle="default">
              Add new client profile
            </Button>
          </Link>
          <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
            Add clients by uploading CSV
          </Button>
          <hr/>
          { p.clientsLoaded &&
            <ClientsIndex>{
              _.map(p.clients, (client) => {
                return (
                  <ClientRow
                    key={client.id}
                    client={client}
                    handleShow={this.handleDeleteModalShow}
                  />
                )
              })
            }</ClientsIndex>
          }
        </div>
        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
        <DeleteModal
          contentType='Client'
          objectId={this.state.objectId}
          show={this.state.deleteModalShow}
          onHide={this.handleDeleteModalHide}
          delete={this.handleDelete}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.clients.byId,
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);
