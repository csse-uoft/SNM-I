import _ from 'lodash';
import React, { Component } from 'react';

import { Col, Form, FormGroup, InputGroup, Button, FormControl } from 'react-bootstrap';


export default class ServiceSearchBar  extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBy: '',
      queryTerm: ''
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
              <FormControl
                componentClass="select"
                value={this.state.searchBy}
                onChange={e => this.handleFormValChange(e, 'searchBy')}
              >
                <option value="select">-- Search by --</option>
                <option value="name">Name</option>
                <option value="provider">Provider</option>
                <option value="category">Category</option>
                <option value="des">Description</option>
              </FormControl>
              <InputGroup.Button>
              </InputGroup.Button>
              <FormControl
                type="text"
                value={this.state.queryTerm}
                onChange={e => this.handleFormValChange(e, 'queryTerm')}
              />
              <InputGroup.Button>
                <Button
                  onClick={e => this.props.search(this.state.searchBy, this.state.queryTerm)}
                  disabled={this.state.searchBy === '' || this.state.queryTerm === ''}
                >
                  Search
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </Col>
        </FormGroup>
      </Form>
    );
  }
};
