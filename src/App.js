import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';

// components
import Landing from './components/Landing.js';
import Login from './components/Login.js';

// style
import './stylesheets/App.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
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
            <Nav pullRight>
              <IndexLinkContainer to={`/login`}>
                <NavItem eventKey={1} href="#">Log In</NavItem>
              </IndexLinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path='/' component={Landing}/>
        <Route exact path='/login' component={Login}/>
      </div>
    );
  }
}

export default App;
