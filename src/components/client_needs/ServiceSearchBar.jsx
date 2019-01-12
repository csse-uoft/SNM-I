import _ from 'lodash';
import React, { Component } from 'react';
import { formatLocation } from '../../helpers/location_helpers'

import { Col, Form, FormGroup, InputGroup, Button, FormControl } from 'react-bootstrap';


export default class ServiceSearchBar  extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryTerm: '',
      location: props.location.street_address
    }

    this.handleFormValChange = this.handleFormValChange.bind(this);
  }

  handleFormValChange(e, id=e.target.id) {
    this.setState({ [id] : e.target.value });
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={12}>
            <InputGroup>
              {this.props.enableQueryTerm &&
                <InputGroup.Addon>Find</InputGroup.Addon>
              }
              {this.props.enableQueryTerm &&
                <FormControl
                  type="text"
                  value={this.state.queryTerm}
                  onChange={e => this.handleFormValChange(e, 'queryTerm')}
                  placeholder="Dental service, language class..."
                />
              }
              <InputGroup.Addon>Near</InputGroup.Addon>
              <FormControl
                type="text"
                value={this.state.location}
                onChange={e => this.handleFormValChange(e, 'location')}
              />
              <InputGroup.Button>
                {this.props.enableQueryTerm ? (
                  <Button
                    onClick={e => this.props.search(this.state.queryTerm, this.state.location)}
                  >
                    Search
                  </Button>
                ) : (
                  <Button
                    onClick={e => this.props.search(this.state.location, this.props.needId)}
                  >
                    Search
                  </Button>
                )}
              </InputGroup.Button>
            </InputGroup>
          </Col>
        </FormGroup>
      </Form>
    );
  }
};
