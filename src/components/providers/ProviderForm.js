import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap'
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';

// Mapping
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

export default class ProviderForm extends Component {
  constructor(props) {
    super(props);
    const provider = this.props.provider,
          lk = provider.location;
    this.state = { 
      form: {
        id: provider.id || '',
        first_name: provider.first_name || '',
        last_name: provider.last_name || '',
        email: provider.email || '',
        home_phone: provider.home_phone || '',
        cell_phone: provider.cell_phone || '',
        referrer: provider.referrer || '',
        location: {
          lng_lat: (lk && parsePointCoordinates(lk.geometry.coordinates)) || '',
          address: (lk && lk.properties.address) || ''
        }
      },
      mapZoom: 10
    } 
  }

  render() {
    const s = this.state,
          torontoCentroid = { lat: 43.6870, lng: -79.4132 },
          autoCompleteInputProps = {
            value: this.state.form.location.address, 
            onChange: this.addressValChange
          };
    const isEnabled = 
      this.state.form.home_phone.length > 0 &&
      this.state.form.email.length > 0 &&
      this.state.form.first_name.length > 0 &&
      this.state.form.last_name.length > 0
    const GMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={s.mapZoom}
        defaultCenter={this.hasLocation() ? s.form.location.lng_lat : torontoCentroid} >
        {this.hasLocation() &&
          <Marker position={s.form.location.lng_lat} />
        }
      </GoogleMap>
    ));
    return (
      <Row>
        <Col sm={8}>
          <Form horizontal>
            <FormGroup controlId="first_name">
              <Col componentClass={ControlLabel} sm={3}>
                First name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.first_name} 
                  placeholder="Aravind"
                  onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="last_name">
              <Col componentClass={ControlLabel} sm={3}>
                Last name (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.last_name} 
                  placeholder="Adiga"
                  onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="email">
              <Col componentClass={ControlLabel} sm={3}>
                Email (required)
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.email} 
                  placeholder="aravind.adiga.gmail.com"
                  onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="cell_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Cell Phone
              </Col>
              <Col sm={9}>
                <FormControl type="tel" value={this.state.form.cell_phone} 
                  onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="home_phone">
              <Col componentClass={ControlLabel} sm={3}>
                Home Phone (required)
              </Col>
              <Col sm={9}>
                <FormControl type="tel" value={this.state.form.home_phone} 
                  onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="address">
              <Col componentClass={ControlLabel} sm={3}>
                Address
              </Col>
              <Col sm={9}>
                <PlacesAutocomplete inputProps={autoCompleteInputProps} onSelect={this.addressSelected}
                  styles={{root: { zIndex: 1 }}} />
              </Col>
            </FormGroup>

            <FormGroup controlId="referrer">
              <Col componentClass={ControlLabel} sm={3}>
                Referred By
              </Col>
              <Col sm={9}>
                <FormControl type="text" value={this.state.form.referrer} 
                  onChange={this.formValChange} />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={9}>
                <Button disabled = {!isEnabled} type="submit" onClick={this.submit}>
                  Submit
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
        <Col sm={4}>
            <div style={{width: '100%', height: '190px'}}>
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
      </Row>
    )
  }

  submit = () => {
    let form = this.state.form;
    
    if (this.hasLocation()) { 
      form.location.lng_lat = encodePointCoordinates(form.location.lng_lat);
    } else {
      form.location = null;
    }

    if (_.isEmpty(form.birthdate)) form.birthdate = null;

    this.props.action(form);
  }

  formValChange = (e) => {
    let nextForm = {...this.state.form, [e.target.id]: e.target.value};
    this.setState({ form: nextForm });    
  }

  addressValChange = (val) => {
    let updateVals = {address: val};
    if (_.isEmpty(_.trim(val))) updateVals.lng_lat = '';
    let nextLocation = {...this.state.form.location, ...updateVals};
    let nextForm = {...this.state.form, location: nextLocation};
    this.setState({ form: nextForm });    
  }

  addressSelected = (address) => {
    this.addressValChange(address);

    geocodeByAddress(address)
      .then((results) => {
          return getLatLng(results[0])
        }
      )
      .then(({ lat, lng }) => {
        let nextLngLat = {lat, lng},
            nextLocation = {...this.state.form.location, lng_lat: nextLngLat},
            nextForm = {...this.state.form, location: nextLocation};
        this.setState({ form: nextForm, mapZoom: 14 })
      })
      .catch((error) => {
        console.log('Oh no!', error)
      })
  }

  hasLocation = () => {
    return !_.isEmpty(_.trim(this.state.form.location.lng_lat));
  }

}