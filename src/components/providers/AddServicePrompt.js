import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table, Button, Glyphicon } from 'react-bootstrap';

export default class AddServicePrompt extends Component {
  render() {
    return(
      <div>
        <h2>Would you like to add a service for this provider?</h2>
        <Link to={`/service/new`}>
          <Button bsStyle="default">
            Yes
          </Button>
        </Link>
        <Link to={`/providers`}>
          <Button bsStyle="default">
            No
          </Button>
        </Link>
      </div>
    )
  }
}