import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import { Button, Row, Col } from 'react-bootstrap';
import '../stylesheets/Dashboard.css';


class Dashboard extends Component {
  render() {
    return(
      <Row className='content login-pane'>
        <Col md={12}>
          <div className="login-buttons">
            <Link to={`/users`}>
              <Button bsStyle="default" className="btn-default-login" block>
                Manage User
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

    )
  }
}


export default Dashboard;
