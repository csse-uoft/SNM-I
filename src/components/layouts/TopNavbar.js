import React, { Component } from 'react';
import { IndexLinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

// redux
import { connect } from 'react-redux';
import { logout } from '../../store/actions/authAction.js';

class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
    this.signout = this.signout.bind(this);
  }

  signout() {
    this.props.dispatch(logout())
  }

  render() {
    const navItems = (this.props.isLoggedin) ? (
      <Nav>
        <IndexLinkContainer to={`/clients`}>
          <NavItem eventKey={1} href="#">Clients</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to={`/services`}>
          <NavItem eventKey={2} href="#">Services</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to={`/goods`}>
          <NavItem eventKey={2} href="#">Goods</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to={`/providers`}>
          <NavItem eventKey={3} href="#">Providers</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to={`/reporting`}>
          <NavItem eventKey={4} href="#">Reporting</NavItem>
        </IndexLinkContainer>

      </Nav>
      )
      : (null);

    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            {(this.props.isLoggedin) ? (
              <IndexLinkContainer to='/dashboard'>
                <div>
                  <span>SNM Impact</span>
                </div>
              </IndexLinkContainer>
            ) : (
              <IndexLinkContainer to='/'>
                <div>
                  <span>SNM Impact</span>
                </div>
              </IndexLinkContainer>
            )}
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          {navItems}
          <div className="home-agency-branding">
            {this.props.organization && this.props.organization.name}
          </div>
          <Nav pullRight>
            {(this.props.isLoggedin) ? (
              <NavItem eventKey={4} href="#" onClick={this.signout}>Log Out</NavItem>
            ) : (
              <IndexLinkContainer to={`/login`}>
                <NavItem eventKey={4} href="#">Log In</NavItem>
              </IndexLinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
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
)(withRouter(TopNavbar));
