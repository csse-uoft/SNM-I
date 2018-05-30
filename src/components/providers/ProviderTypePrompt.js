import React, { Component } from 'react';
import _ from 'lodash';

import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { encodePointCoordinates, parsePointCoordinates } from '../../util.js';
import { Link } from 'react-router-dom';

// Mapping
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";


export default class ProviderTypePrompt extends Component {
  constructor(){
    super();
    this.setProviderType = this.setProviderType.bind(this);
    this.state = { providerType: 'select'};
  }

  setProviderType(e) {
    this.setState({providerType: e.target.value})
  }

  render() {
    const isEnabled = (this.state.providerType !== 'select');

    return (
      <Row className="content">
        <Col sm={12}>
          <h3>New Provider Profile</h3>
          <hr/>
        </Col>

        <Col sm={12}>
          <Form horizontal>
            <FormGroup controlId="providerType">
              <Col componentClass={ControlLabel} sm={3}>
                Please select a provider type
              </Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select" onChange={this.setProviderType}>
                  <option value="select"> Select </option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </FormControl>
              </Col>
            </FormGroup>
          </Form>
        </Col>
        <div>
          <Link to={`/providers/new/${this.state.providerType}`}>
            <Button disabled={!isEnabled} type="submit">
              Continue
            </Button>
          </Link>

          <Link to={`/providers/`}>
            <Button disabled={false} type="submit">
              Cancel
            </Button>
         </Link>
        </div>
      </Row>
    );
  }
}
