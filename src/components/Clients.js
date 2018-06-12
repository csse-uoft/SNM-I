import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ClientsIndex from './clients/ClientsIndex'
import ClientRow from './clients/ClientRow'
import CSVUploadModal from './shared/CSVUploadModal'

// redux
import { connect } from 'react-redux'
import { fetchClients, createClients, CLIENT_ERROR } from '../store/actions/clientActions.js'

// styles
import { Button } from 'react-bootstrap';
import '../stylesheets/Client.css';

class Clients extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit .bind(this);

    this.state = {
      show: false
    };
  }

  handleHide() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(createClients(file)).then((status) => {
      if (status === CLIENT_ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ show: false })
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
          <Button bsStyle="default"  onClick={this.handleShow}>
            Add clients by uploading CSV
          </Button>
          <hr/>
          { p.clientsLoaded &&
            <ClientsIndex>{
              _.map(p.clients, (client) => {
                return <ClientRow key={ client.id } client={ client } />
              })
            }</ClientsIndex>
          }
        </div>
        <CSVUploadModal
          show={this.state.show}
          onHide={this.handleHide}
          submit={this.handleSubmit}
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
