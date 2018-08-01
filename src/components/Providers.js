import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'
import CSVUploadModal from './shared/CSVUploadModal'
// redux
import { connect } from 'react-redux'
import { fetchProviders, createProviderWithCSV } from '../store/actions/providerActions.js'
// styles
import { Button, Col, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom';
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
        key={this.props.provider.id}
        position={this.props.provider.main_address.lat_lng}
        onMouseOver={() => this.onMouseEnter()}
        onMouseOut={() => this.onMouseLeave()}
      >
      {this.state.isOpen &&
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
        <div> <b>Provider id: </b>
          {<Link to={`/provider/${provider.id}`}>
            {provider.id}
          </Link>}
        </div>
        <div> {this.props.provider.provider_type === "Individual" ?
          <text>
            <b>Provider name: </b>
            {this.props.provider.first_name + " " + this.props.provider.last_name}
          </text> :
          <text>
            <b>Company: </b>
              {this.props.provider.company}
          </text>}
        </div>
      </div>
    )
  }
}


class Providers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CSVModalshow: false
    }
    this.handleCSVModalHide = this.handleCSVModalHide.bind(this);
    this.handleCSVModalShow = this.handleCSVModalShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
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

  render() {
    const p = this.props;
    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }

    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid} >
        {
          _.map(this.props.providers, (provider) => {
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
          <ProvidersIndex>{
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider } />
            })
          }
          </ProvidersIndex>
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
