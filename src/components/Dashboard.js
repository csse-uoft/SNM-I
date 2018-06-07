import React, { Component } from 'react';
import { Link } from 'react-router-dom'

// redux
import { connect } from 'react-redux';

import { Button, Row, Col } from 'react-bootstrap';
import '../stylesheets/Dashboard.css';


class Dashboard extends Component {
  render() {
    const p = this.props;
    return(
      <Row className='content login-pane'>
        <Col md={12}>
          <div className="login-buttons">
            { p.isLoggedin && p.currentUser.is_admin &&
              <Link to={`/users`}>
                <Button bsStyle="default" className="btn-default-login" block>
                  Manage User
                </Button>
              </Link>
            }
          </div>
        </Col>
      </Row>

    )
  }
}


const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser,
    organization: state.auth.organization,
    isLoggedin: state.auth.isLoggedin
  }
}

export default connect(
  mapStateToProps
)(Dashboard);
