import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ServicesIndex from './services/ServicesIndex.js'
import ServiceRow from './services/ServiceRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchServices, searchServices, createServices, deleteService, SERVICE_ERROR } from '../store/actions/serviceActions.js'

// styles
import { Button, Col} from 'react-bootstrap';
import '../stylesheets/Client.css';

import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

class MapMarker extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
    }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.closeInfoBox = this.closeInfoBox.bind(this);
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
      isOpen: false
    })
  }

  render() {
    return (
      <Marker
        key={this.props.service.id}
        position={this.props.service.location.lat_lng}
        onMouseOver={() => this.onMouseEnter()}
        onMouseOut={() => this.onMouseLeave()}
      >
      {this.state.isOpen &&
        <InfoWindow onCloseClick={() => this.closeInfoBox()}>
          <ServiceInfoBox service={this.props.service}/>
        </InfoWindow>
      }
      </Marker>
    )
  }

}

class ServiceInfoBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const service = this.props.service;
    return(
      <div>
        <b>Service name: </b>
          {<Link to={`/services/${service.id}`}>
            {service.id}
          </Link>}
      </div>
    )
  }
}

class Services extends Component {
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
    this.props.dispatch(createServices(file)).then((status) => {
      if (status === SERVICE_ERROR) {
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
    this.props.dispatch(deleteService(id, form)).then((status) => {
      if (status === SERVICE_ERROR) {
        // this.setState({ displayError: true });
      } else {
        this.setState({ deleteModalShow: false })
      }
    });
  }

  componentWillMount() {
    this.props.dispatch(fetchServices());
  }

  render() {
    const p = this.props;

    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }
    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid} >
        {
          _.map(p.services, (service) => {
            return <MapMarker service={service}/>
          })
        }
      </GoogleMap>
    ));

    return(
      <div className='services-table content modal-container'>
        <div>
          <h1>Services</h1>
          <Link to='/services/new'>
            <Button bsStyle="default">
              Add new service
            </Button>
          </Link>{' '}
          <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
            Add services by uploading CSV
          </Button>
          <hr/>
          { p.servicesLoaded &&
            <ServicesIndex>{
              _.map(p.services, (service) => {
                return <ServiceRow key={ service.id } service={ service } handleShow={this.handleDeleteModalShow} />
              })
            }</ServicesIndex>
          }
          <hr/>
          { p.servicesLoaded &&
          <div>
          <Col sm={4}>
            <div style={{width: '250%', height: '400px'}}>
              <GMap
                containerElement={
                  <div style={{ height: `100%` }} />
                }
                mapElement={
                  <div style={{ height: `100%` }} />
                }
              />
            </div>
          </Col>
        </div> }
        </div>


        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
        <DeleteModal
          contentType='Service'
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
    services: state.services.filteredServices || [],
    servicesLoaded: state.services.servicesLoaded
  }
}

export default connect(
  mapStateToProps
)(Services);
