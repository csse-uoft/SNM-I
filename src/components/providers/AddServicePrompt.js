import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button } from 'react-bootstrap';

export default class AddServicePrompt extends Component {
  render() {
    return(
      <Row className="content">
        <div>
          <h2>Would you like to add a service for this provider?</h2>
          <hr/>
          <Link to={`/service/new`}>
            <Button bsStyle="default">
              Yes
            </Button>
          </Link>
          &nbsp; &nbsp;
          <Link to={`/providers`}>
            <Button bsStyle="default">
              No
            </Button>
          </Link>
        </div>
      </Row>
    )
  }
}