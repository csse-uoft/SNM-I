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
import { Button, Col, Pagination } from 'react-bootstrap';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

class MapMarker extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      isClicked: false
    }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.closeInfoBox = this.closeInfoBox.bind(this);
    this.openInfoBox = this.openInfoBox.bind(this);
  }

  onMouseEnter() {
    this.setState({
      isOpen: true
    })
  }

  onMouseLeave() {
    this.setState({
      isOpen: false
    })
  }

  closeInfoBox() {
    this.setState({
      isClicked: false
    })
  }

  openInfoBox() {
    this.setState({
      isClicked: true
    })
  }

  render() {
    if (this.props.client.address) {
      return (
        <Marker
          key={this.props.client.id}
          position = {{ lat: parseFloat(this.props.client.address.lat),
                        lng: parseFloat(this.props.client.address.lng) }}
          onMouseOver={() => this.onMouseEnter()}
          onMouseOut={() => this.onMouseLeave()}
          onClick={this.openInfoBox}
        >
        {(this.state.isOpen || this.state.isClicked) &&
          <InfoWindow onCloseClick={() => this.closeInfoBox()}>
            <ClientInfoBox client={this.props.client}/>
          </InfoWindow>
        }
        </Marker>
      )
    } else {
      return null
    }
  }
}

// this will show a info box for each client on the map
class ClientInfoBox extends Component {
  render() {
    const client = this.props.client;
    return(
      <div>
        <b>Client: </b>
          {<Link to={`/clients/${client.id}`}>
            {client.profile.first_name.concat(" ", client.profile.last_name)}
          </Link>}
      </div>
    )
  }
}

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

    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }
    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid}
      >
        {         
          _.map(clientsOnPage, (client) => {            
              return <MapMarker key={client.id} 
                client={client}/>
          })
        }
      </GoogleMap>
    ));

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
        <hr/>
        { p.clientsLoaded &&
          <div>
            <Col sm={4}>
              <div style={{width: '250%', height: '500px'}}>
                <GMap
                  containerElement={
                    <div style={{ height: `100%` }} />
                  }
                  mapElement={
                    <div style={{ height: `80%` }} />
                  }
                />
              </div>
            </Col>
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
