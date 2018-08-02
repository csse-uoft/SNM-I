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
    this.handleSortByChange = this.handleSortByChange.bind(this);

    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null,
      clientsOrder: this.props.clientsOrder,
      searching: false,
      orderBy: '-updated_at'
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchClients());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ clientsOrder: nextProps.clientsOrder });
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
      newlyDisplayed = _.reduce(this.props.clientsOrder, (result, clientId) => {
        const client = this.props.clients[clientId];
        if (client.last_name.toLowerCase().includes(value.toLowerCase())) {
          result.push(client.id)
        }
        return result;
      }, []);
    }
    else if (type === 'address'){
      newlyDisplayed = _.reduce(this.props.clientsOrder, (result, clientId) => {
        const client = this.props.clients[clientId];
        if (formatLocation(client.address).toLowerCase().includes(value.toLowerCase())) {
          result.push(client.id)
        }
        return result;
      }, []);
    }
    this.setState({
      clientsOrder: newlyDisplayed,
      searching: true
    })
  }

  handleSortByChange(e) {
    this.props.dispatch(fetchClients(e.target.value));
    this.setState({
      orderBy: e.target.value
    })
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
          handleSortByChange={this.handleSortByChange}
          orderBy={this.state.orderBy}
        />
        <hr/>
        {p.clientsLoaded && (
          <div>
            {(Object.keys(this.state.clientsOrder).length > 0)
              ? <ClientsIndex>{
                _.map(this.state.clientsOrder, (clientId) => {
                  const client = p.clients[clientId]
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
    clientsOrder: state.clients.order,
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);
