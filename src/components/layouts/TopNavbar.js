import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

// redux
import { connect } from 'react-redux';
import { login, logout } from '../../store/actions/authAction.js';

class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
    this.signout = this.signout.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.isLoggedin) { 
      this.props.history.push('/login')
    }
  }

  signout() {
    this.props.dispatch(logout())
  }

  render() {
    const p = this.props
    const navItems = (this.props.isLoggedin) ? (
      <Nav>
        <IndexLinkContainer to={`/clients`}>
          <NavItem eventKey={1} href="#">Clients</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to={`/services`}>
          <NavItem eventKey={2} href="#">Services</NavItem>
        </IndexLinkContainer>
        <IndexLinkContainer to={`/users`}>
          <NavItem eventKey={3} href="#">Users</NavItem>
        </IndexLinkContainer>
      </Nav>
      )
      : (null);

    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLinkContainer to={`/`}>
              <div>
                <span>SNM Impact</span>
              </div>
            </IndexLinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          {navItems}
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
    isLoggedin: state.auth.isLoggedin
  }
}

export default connect(
  mapStateToProps
)(withRouter(TopNavbar));
