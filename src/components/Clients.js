import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ClientSearchBar from './clients/ClientSearchBar'
import ClientsIndex from './clients/ClientsIndex'
import ClientRow from './clients/ClientRow'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

import { formatLocation } from '../helpers/location_helpers'

// redux
import { connect } from 'react-redux'
import { fetchClients, createClients, deleteClient, CLIENT_ERROR } from '../store/actions/clientActions.js'

// styles
import { Button } from 'react-bootstrap';

class Clients extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleSearchBarChange = this.handleSearchBarChange.bind(this);

    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null,
      displayedClients: this.props.clients,
      searching: false
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
    this.setState({ deleteModalShow: false });
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

  handleSearchBarChange(type, value) {
    let newlyDisplayed;
    if (type === 'last_name') {
      newlyDisplayed = _.filter(this.props.clients, client => {
        return client.last_name.toLowerCase().includes(value.toLowerCase())
      })
    }
    else if (type === 'address'){
      newlyDisplayed = _.filter(this.props.clients, client => {
        return formatLocation(client.address).toLowerCase().includes(value.toLowerCase())
      })
    }
    this.setState({
      displayedClients: newlyDisplayed,
      searching: true
    })
  }

  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  render() {
    const p = this.props;
    return(
      <div className='content modal-container'>
        <h1>Clients</h1>
        <Link to='/clients/new'>
          <Button bsStyle="default">
            Add new client profile
          </Button>
        </Link>{' '}
        <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
          Add clients by uploading CSV
        </Button>
        <hr/>
        <ClientSearchBar
          handleSearchBarChange={this.handleSearchBarChange}
        />
        <hr/>
        {p.clientsLoaded && (
          <div>
            {(Object.keys(this.state.displayedClients).length > 0)
              ? <ClientsIndex>{
                _.map(this.state.displayedClients, (client) => {
                  return (
                    <ClientRow
                      key={client.id}
                      client={client}
                      handleShow={this.handleDeleteModalShow}
                    />
                  )
                })
              }</ClientsIndex>
              : (<div>
                  <h5>
                    {(this.state.searching)
                      ? 'There are no clients matching this search query term.'
                      : 'There are currently no clients stored in the database.'
                    }
                  </h5>
                </div>)
            }
          </div>)
        }
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
