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
            { p.isLoggedin && p.currentUser.is_admin && !p.organization.id &&
              <Link to={{ pathname: '/providers/new/organization', state: { status: 'Home Agency'} }}>
                <Button bsStyle="default" className="btn-default-login" block>
                  Create organization profile for home agency
                </Button>
              </Link>
            }
            { p.isLoggedin && p.currentUser.is_admin && p.organization.id &&
              <Link to={`/provider/${p.organization.id}/edit/organization`}>
                <Button bsStyle="default" className="btn-default-login" block>
                  Edit organization profile for home agency
                </Button>
              </Link>
            }
            { p.isLoggedin && p.currentUser.is_admin &&
              <div>
                <Link to='/users'>
                  <Button bsStyle="default" className="btn-default-login" block>
                    Manage Users
                  </Button>
                </Link>
                <Link to='/admin-logs'>
                  <Button bsStyle="default" className="btn-default-login" block>
                    Admin Logs
                  </Button>
                </Link>
                <Link to='/eligibility-criteria'>
                  <Button bsStyle="default" className="btn-default-login" block>
                    Manage Eligibility criteria
                  </Button>
                </Link>
              </div>
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
