import React, { Component } from 'react'
import _ from 'lodash'

// components
import ProvidersIndex from './providers/ProvidersIndex.js'
import ProviderRow from './providers/ProviderRow.js'

// redux
import { connect } from 'react-redux'
import { searchProviders, fetchProviders, createProvider, updateProvider, deleteProvider } from '../store/actions/providerActions.js'
// styles
import { Button, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';


class Providers extends Component {
  constructor(props) {
    super(props);
    this.deleteProvider=this.deleteProvider.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchProviders());
  }

  deleteProvider(id) {
    this.props.dispatch(deleteProvider(id));
  }

  getCoordinates(address) {
    //let parsedAddress = address.street_address + "," + address.city + "," + address.province;
    geocodeByAddress(address)
      .then((result) => getLatLng(result[0]))
      .then(({ lat, lng }) => (lat, lng))
      .then((latlng) => latlng);
  }

  render() {
    const p = this.props;
    console.log(this.getCoordinates("3362 Cobblestone Ave, Vancouver"));
    const torontoCentroid = { lat: 43.6870, lng: -79.4132 }
    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={torontoCentroid} >
        {
          <Marker position={torontoCentroid} />
        }
      </GoogleMap>
    ));
    return(
      <div className='providers content'>
        <h3 className='title'>Providers</h3>
          <div>
            <Link to={`/providers/new/upload`}>
              <Button bsStyle="default" >
              Upload from CSV
              </Button>
            </Link>
            <Link to={`/providers/new`}>
              <Button bsStyle="default" >
              Add new provider
              </Button>
            </Link>
          </div>
          <hr/>
        { p.providersLoaded &&
          <ProvidersIndex>{
            p.providers.map((provider) => {
              return <ProviderRow key={ provider.id } provider={ provider }
                      delete={this.deleteProvider} />
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
