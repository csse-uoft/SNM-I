import _ from 'lodash';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'

import './style.css';

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
  constructor(props) {
    super(props);
    console.log("---------------->initial this: ", this);
    this.state = {
      CSVModalshow: false,
      deleteModalShow: false,
      objectId: null,
      filteredClients: this.props.clients,
      numberPerPage: 10,
      currentPage: 1
    };
  
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);
  }
    

  componentDidMount(){
    this.props.dispatch(fetchClients());
    console.log("----------->componentDidMount", this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filteredClients: nextProps.clients });
    console.log("-------->componentWillReceiveProps", nextProps);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   return nextProps.clients === prevState.filteredClients
  //   ? {}
  //   : {filteredClients: nextProps.clients}
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
          console.log("csvmodalshow false");
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

  changePage(e) {
    this.setState({currentPage: Number(e.target.text)});
  }

  changeNumberPerPage(e) {
    if (e.target.value === 'all') {
      console.log("------------>change number per page: ", this.props);
      this.setState({
        numberPerPage: this.props.clients.length,
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
    console.log("---------------> this.state.filteredClients: ", this.state.filteredClients);
    let clientsOnPage = this.state.filteredClients.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(this.state.filteredClients.length/this.state.numberPerPage); number++) {
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
        {p.clientsLoaded && 
          <div>
            <ClientsIndex changeNumberPerPage={this.changeNumberPerPage}>{
                clientsOnPage.map((client) => {
                  if (client){
                    return <ClientRow key={client.id} client={client}  handleShow={this.handleDeleteModalShow} />
                  }})
            }</ClientsIndex>
            <Pagination className="pagination">
            {pageNumbers}
            </Pagination>
          </div>
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
    clients: state.clients.filteredClients || [],
    clientsLoaded: state.clients.clientsLoaded
  }
}

export default connect(
  mapStateToProps
)(Clients);
