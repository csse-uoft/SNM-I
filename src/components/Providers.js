import _ from 'lodash'
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { ACTION_ERROR } from '../store/defaults.js'
import { formatLocation } from '../helpers/location_helpers.js';


import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
import DeleteModal from './shared/DeleteModal'

import { providerFormTypes } from '../constants/provider_fields.js'

// redux
import { connect } from 'react-redux'
import { fetchProviders, createProviderWithCSV, deleteProvider} from '../store/actions/providerActions.js'

// styles
import { Button, Col, Glyphicon, Pagination, DropdownButton, MenuItem } from 'react-bootstrap'
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
    if (this.props.provider.main_address) {
      return (
        <Marker
          key={this.props.provider.id}
          position={this.props.provider.main_address.lat_lng}
          onMouseOver={() => this.onMouseEnter()}
          onMouseOut={() => this.onMouseLeave()}
          onClick={this.openInfoBox}
        >
        {(this.state.isOpen || this.state.isClicked) &&
          <InfoWindow onCloseClick={() => this.closeInfoBox()}>
            <ProviderInfoBox provider={this.props.provider}/>
          </InfoWindow>
        }
        </Marker>
      )
    } else {
      return null
    }
  }

}

// this will show a info box for each provider on the map
class ProviderInfoBox extends Component {
  render() {
    const provider = this.props.provider;
    return(
      <div>
        <div> {this.props.provider.type === "Individual" ?
          <text>
            <b>Provider name: </b>
            {<Link to={`/provider/${provider.id}`}>
              {this.props.provider.profile.first_name + " " + this.props.provider.profile.last_name}
            </Link>}
          </text> :
          <text>
            <b>Company: </b>
            {<Link to={`/provider/${provider.id}`}>
              {this.props.provider.company}
            </Link>}
          </text>}
        </div>
        <div>
          <text>
            <b>Provider address: </b>
            {formatLocation(provider.main_address).split(",").map(line => <div key={line}> {line} </div>)}
          </text>
        </div>
      </div>
    )
  }
}


class Providers extends Component {
  constructor(props) {
    super(props);
    console.log("-----------> constructor props: ", this.props);
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleDeleteModalHide = this.handleDeleteModalHide.bind(this);
    this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);
    
    this.state = {
      deleteModalshow: false,
      objectId: null,
      filteredProviders: this.props.providers,
      CSVModalshow: false,
      numberPerPage: 10,
      currentPage: 1,
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchProviders());
    console.log("------------------>componentDidMount");
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filteredProviders: nextProps.providers });
    console.log("-------->componentWillReceiveProps", this.props);
  }

  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(
      createProviderWithCSV(file, (status) => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ CSVModalshow: false })
        }
      })
    )
  }

  handleDeleteModalHide() {
    this.setState({ deleteModalShow: false });
    console.log("------------------>handleDeleteModalHide");
  }

  handleDeleteModalShow(id) {
    this.setState({
      deleteModalShow: true,
      objectId: id
    })
    console.log("------------------>handleDeleteModalShow");
  }

  handleDelete(id, form) {
    this.props.dispatch(
      deleteProvider(id, form, status => {
        if (status === ACTION_ERROR) {
          // this.setState({ displayError: true });
        } else {
          this.setState({ deleteModalShow: false });
        }
      })
    );
    console.log("------------------>handleDelete");
  }


  changePage(e) {
    this.setState({currentPage: Number(e.target.text)});
  }

  changeNumberPerPage(e) {
    if (e.target.value === 'all') {
      this.setState({
        numberPerPage: this.props.providers.length,
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
    console.log("------------------>render", this.props);
    console.log("provider render state: ", this.state);

    const p = this.props;
    let providersOnPage = this.state.filteredProviders.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);
    let pageNumbers = [];
    for (let number = 1; number <= Math.ceil(this.state.filteredProviders.length/this.state.numberPerPage); number++) {
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
          _.map(providersOnPage, (provider) => {
            return <MapMarker key={provider.id} 
            provider={provider}/>
          })
        }
      </GoogleMap>
    ));

    return(
       <div className="providers content">
        <h1>Providers</h1>
        <hr/>
          <div>
            <DropdownButton
              id="provider-form-type-dropdown"
              bs="default"
              title="Add new provider"
            >
              {_.map(providerFormTypes, (formType, value) =>
                <MenuItem
                  key={value}
                  eventKey={value}
                  href={`/providers/${value}/new`}
                >
                  {formType}
                </MenuItem>
              )}
            </DropdownButton>
            {' '}
            <Button bsStyle="default" onClick={this.handleCSVModalShow}>
              Add providers by uploading CSV
            </Button>
            {' '}
            <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
              <Glyphicon glyph="print" />
            </Button>
          </div>
         <hr/>
        { p.providersLoaded && 
          <div>
            <ProvidersIndex changeNumberPerPage={this.changeNumberPerPage}>{
              providersOnPage.map((provider) => {
                return <ProviderRow key={ provider.id } provider={ provider } handleShow={this.handleDeleteModalShow}/>
              })
            }</ProvidersIndex>
            <Pagination className="pagination">
              {pageNumbers}
            </Pagination>
          </div>
        }
        <hr/>
        { p.providersLoaded &&
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
        contentType="Provider"
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
  console.log('map state to prop provider state:', state);
  return {
    providers: state.providers.filteredProviders || [],
    providersLoaded: state.providers.providerLoaded
  }
}

export default connect(
  mapStateToProps
)(Providers);
