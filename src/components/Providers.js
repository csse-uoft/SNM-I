import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
import './../stylesheets/Providers.css'

// redux
import { connect } from 'react-redux'
import { fetchProviders, createProviderWithCSV } from '../store/actions/providerActions.js'
import { formatLocation } from '../helpers/location_helpers.js'
// styles
import { Button, Col, Glyphicon, Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

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
  }

}

class ProviderInfoBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const provider = this.props.provider;
    return(
      <div>
        <div> {this.props.provider.provider_type === "Individual" ?
          <text>
            <b>Provider name: </b>
            {<Link to={`/provider/${provider.id}`}>
              {this.props.provider.first_name + " " + this.props.provider.last_name}
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
    this.state = {
      CSVModalshow: false,
      numberPerPage: 10,
      currentPage: 1
    }
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeNumberPerPage = this.changeNumberPerPage.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.providers !== prevProps.providers) {
      this.setState({currentPage: 1});
    }
  }
  handleCSVModalHide() {
    this.setState({ CSVModalshow: false });
  }

  handleCSVModalShow() {
    this.setState({ CSVModalshow: true })
  }

  handleSubmit(e) {
    const file = document.querySelector('input[type="file"]').files[0];
    this.props.dispatch(createProviderWithCSV(file)).then(() =>
        this.setState({ CSVModalshow: false })
    );
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
    const p = this.props;
    let providersOnPage = p.providers.slice(
      this.state.numberPerPage * (this.state.currentPage - 1),
      this.state.numberPerPage * this.state.currentPage);

    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }

    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid} >
        {
          _.map(providersOnPage, (provider) => {
            return <MapMarker provider={provider}/>
          })
        }
      </GoogleMap>
    ));

    return(
      <div className='providers content'>
        <h3 className='title'>Providers</h3>
          <div>
            <Link to={`/providers/new`}>
              <Button bsStyle="default" >
              Add new provider
              </Button>
            </Link>
            &nbsp;
            <Button bsStyle="default" onClick={this.handleCSVModalShow}>
              Add providers by uploading CSV
            </Button>
            &nbsp;
            <Button bsStyle="primary" onClick={() => window.print()} className="print-button">
              <Glyphicon glyph="print" />
            </Button>
          </div>
          <hr/>
        { p.providersLoaded &&
          <div>
          <ProvidersIndex changeNumberPerPage={this.changeNumberPerPage}>{
            providersOnPage.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider } />
            })
          }
          </ProvidersIndex>
            <Pagination className="pagination"
              activePage={this.state.currentPage}
              items={Math.ceil(p.providers.length/this.state.numberPerPage)}
              onClick={this.changePage}>
            </Pagination>
          </div>
        }
        <hr/>
        { p.providersLoaded &&
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
        </div>
      }
        <CSVUploadModal
          show={this.state.CSVModalshow}
          onHide={this.handleCSVModalHide}
          submit={this.handleSubmit}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    providers: state.providers.filteredProviders || [], //array of json 
    providersLoaded: state.providers.loaded
  }
}

export default connect(
  mapStateToProps
)(Providers);
