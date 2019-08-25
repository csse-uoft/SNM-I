import _ from 'lodash';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'
import { formatLocation } from '../helpers/location_helpers'

import ClientSearchBar from './clients/ClientSearchBar'
import ClientsIndex from './clients/ClientsIndex'
import ClientRow from './clients/ClientRow'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchClients, createClients, deleteClient } from '../store/actions/clientActions.js'

// styles
import { Button, Pagination } from 'react-bootstrap';

class Clients extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("------------>", props, "------------------------>", context);
    console.log("---------------->initial this: ", this);
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);


    this.state = {
      CSVModalshow: false,
      deleteModalShow: false,
      objectId: null,
      clientsOrder: this.props.clientsOrder,
      searching: false,
      orderBy: '-updated_at',
      numberPerPage: 10,
      currentPage: 1
    };
  }

  componentDidMount(){
    this.props.dispatch(fetchClients());
    console.log("----------->componentDidMount", this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ clientsOrder: nextProps.clientsOrder });
    console.log("-------->componentWillReceiveProps", nextProps);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   return nextProps.clientsOrder === prevState.clientsOrder
  //   ? {}
  //   : {clientsOrder: nextProps.clientsOrder}
  // }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
    console.log("-------->handleCSVModalHide", this.props);

  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true });
    console.log("-------->handleCSVModalShow", this.props);
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(
      createClients(file, (status) => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ CSVModalshow: false })
        }
      })
    );
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalShow: false });
    console.log("-------->handleDeleteModalHide", this.props);
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    });
    console.log("-------->handleDeleteModalShow", this.props);
  }

  handleDelete(id, form) {
    this.props.dispatch(
      deleteClient(id, form, status => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ deleteModalShow: false });
        }
      })
    );
    console.log("-------->handleDelete", this.props);
  }

  handleSearchBarChange(type, value) {
    let newlyDisplayed;
    console.log("--------------------> search bar change value: ", value);
    if (type === 'last_name') {
      newlyDisplayed = _.reduce(this.props.clientsOrder, (result, clientId) => {
        const client = this.props.clients[clientId];
        if (client.profile.last_name && client.profile.last_name.toLowerCase().includes(value.toLowerCase())) {
          result.push(client.id)
        }
        return result;
      }, []);
    }
    else if (type === 'address'){
      newlyDisplayed = _.reduce(this.props.clientsOrder, (result, clientId) => {
        const client = this.props.clients[clientId];
        if (client.address && formatLocation(client.address).toLowerCase().includes(value.toLowerCase())) {
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

  changePage(e) {
    this.setState({currentPage: Number(e.target.text)});
  }

  changeNumberPerPage(e) {
    if (e.target.value === 'all') {
      console.log("------------>change number per page: ", this.props);
      this.setState({
        numberPerPage: this.props.clientsOrder.length,
        currentPage: 1
      });
    }
    else {
      this.setState({
        numberPerPage: e.target.value,
        currentPage: 1
      });
    }
  }

  render() {
    console.log("-------->render: ", this);
    const p = this.props;
    let clientsOnPage = this.state.clientsOrder.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(this.state.clientsOrder.length/this.state.numberPerPage); number++) {
      pageNumbers.push(
        <Pagination.Item
          key={number}
          active={number ===this.state.currentPage}
          onClick={this.changePage}>{number}
        </Pagination.Item>
      )
    }

    return(
      <div className="content modal-container">
        <h1>Clients</h1>
        <hr/>
        <Link to="/clients/new">
          <Button bsStyle="default">
            Add new client profile
          </Button>
        </Link>{' '}
        <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
          Add clients by uploading CSV
        </Button>
        <hr/>
        <ClientSearchBar
          changeNumberPerPage={this.changeNumberPerPage}
          handleSearchBarChange={this.handleSearchBarChange}
          handleSortByChange={this.handleSortByChange}
          orderBy={this.state.orderBy}
        />
        <hr/>
        {p.clientsLoaded && (
          <div>
            {(Object.keys(this.state.clientsOrder).length > 0)
              ? <ClientsIndex changeNumberPerPage={this.changeNumberPerPage}>{
                  clientsOnPage.map((this.state.clientsOrder, (clientId) => {
                    const client = p.clients[clientId]
                    if (client){
                      return <ClientRow key={client.id} client={client}  handleShow={this.handleDeleteModalShow} />
                    }}))
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
            <Pagination className="pagination">
            {pageNumbers}
            </Pagination>
          </div>)
        }
        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
        <DeleteModal
          contentType="Client"
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
  console.log("----------------->mapStateToProps: ", state);
  return {
    clients: state.clients.byId,
    clientsOrder: state.clients.order,
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);
