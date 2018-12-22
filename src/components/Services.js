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
import { fetchNeeds } from '../store/actions/needActions.js'

// styles
import { Button, Col, Pagination} from 'react-bootstrap';
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

function ServiceInfoBox({ service }) {
  return (
    <div>
      <b>Service name: </b>
        {<Link to={`/service/${service.id}`}>
          {service.name}
        </Link>}
    </div>
  );
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

    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);

    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null,
      numberPerPage: 10,
      currentPage: 1
    };
  }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.services !== prevProps.services) {
      this.setState({currentPage: 1});
    }
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

  changePage(e) {
    this.setState({currentPage: Number(e.target.text)});
  }

  changeNumberPerPage(e) {
    if (e.target.value === 'all') {
      this.setState({
        numberPerPage: this.props.services.length,
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
    this.props.dispatch(fetchNeeds());
  }

  render() {
    const p = this.props;

    let servicesOnPage = p.services.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(p.services.length/this.state.numberPerPage); number++) {
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
          <Link to='/notifications'>      
          You have {p.needs.length} notification(s)
          </Link>
          <hr/>
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
            <div>
            <ServicesIndex changeNumberPerPage={this.changeNumberPerPage}>{
              servicesOnPage.map((service) => {
                return <ServiceRow key={ service.id } service={ service } handleShow={this.handleDeleteModalShow} />
              })
            }</ServicesIndex>
            <Pagination className="pagination">
              {pageNumbers}
            </Pagination>
            </div>
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
    needs: state.needs.needs,
    services: state.services.filteredServices || [],
    servicesLoaded: state.services.servicesLoaded
  }
}

export default connect(
  mapStateToProps
)(Services);
