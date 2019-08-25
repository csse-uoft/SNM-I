import _ from 'lodash';
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'

import ServicesIndex from './services/ServicesIndex.js'
import ServiceRow from './services/ServiceRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

// redux
import { connect } from 'react-redux'
import { fetchServices, createServices, deleteService} from '../store/actions/serviceActions.js'

// styles
import { Button, Col, Pagination, Glyphicon} from 'react-bootstrap';
import '../stylesheets/Client.scss';

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
      isOpen: false
    })
  }

  openInfoBox() {
    this.setState({
      isClicked: true
    })
  }

  render() {
    return (
      <Marker
        key={this.props.service.id}
        position={this.props.service.location.lat_lng}
        onMouseOver={() => this.onMouseEnter()}
        onMouseOut={() => this.onMouseLeave()}
        onClick={this.openInfoBox}
      >
      {(this.state.isOpen || this.state.isClicked) &&
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
  constructor(props) {
    super(props);
    this.state = {
      CSVModalshow: false,
      deleteModalshow: false,
      objectId: null,
      numberPerPage: 10,
      currentPage: 1,
      filteredServices: this.props.services
    }
    console.log("--------------------->this.props: ", this);
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchServices());
    console.log("-------->componentDidMount", this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filteredServices: nextProps.services });
    console.log("-------->componentWillReceiveProps", nextProps);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   return nextProps.services === prevState.filteredServices
  //   ? {}
  //   : {filteredServices: nextProps.services}
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.services.length !== prevProps.services.length) {
  //     this.setState({filteredServices: this.props.services});
  //   }
  // }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(
      createServices(file, (status) => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ CSVModalshow: false })
        }
      })
    )
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
    this.setState({ deleteModalShow: false });
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
    console.log("----------------->handleDeleteModalShow");
  }

  handleDelete(id, form) {
    console.log("-------------->handleDelete id: ", id);
    this.props.dispatch(
      deleteService(id, form, status => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ deleteModalShow: false })
        }
      })
    );
  }

  render() {
    const p = this.props;
    console.log("-------->render: this: ", this);
    let servicesOnPage = this.state.filteredServices.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(this.state.filteredServices.length/this.state.numberPerPage); number++) {
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
          _.map(servicesOnPage, (service) => {
            return <MapMarker key={service.id} 
            service={service} />
          })
        }
      </GoogleMap>
    ));

    return(
      <div className="services content">
        <h1>Services</h1>
        <hr/>
          <div>
            <Link to="/services/new">
              <Button bsStyle="default">
                Add new service
              </Button>
            </Link>{' '}
            <Button bsStyle="default"  onClick={this.handleCSVModalShow}>
              Add services by uploading CSV
            </Button>
            {' '}
            <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
              <Glyphicon glyph="print" />
            </Button>
            </div>
            <hr/>
            { p.servicesLoaded && 
              <div>
                <ServicesIndex changeNumberPerPage={this.changeNumberPerPage}>{
                  servicesOnPage.map((service) => {
                    //const service = p.services[service.id]
                    return (
                      <ServiceRow 
                        key={service.id} 
                        service={service} 
                        handleShow={this.handleDeleteModalShow} 
                      />
                    )
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

  // componentDidUpdate(prevProps) {
  //   if (this.props.services !== prevProps.services) {
  //     this.setState({filteredServices: this.props.services});
  //   }
  // }
}

const mapStateToProps = (state) => {
  console.log("----------------->mapStateToProps: ", state);
  return {
    services: state.services.filteredServices || [],
    servicesLoaded: state.services.servicesLoaded,
  }
}

export default connect(
  mapStateToProps
)(Services);
