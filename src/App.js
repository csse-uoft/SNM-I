import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';

// components
import Landing from './components/Landing.js';
import Login from './components/Login.js';
import LoginPane from './components/LoginPane.js';
import Dashboard from './components/Dashboard.js';
import Clients from './components/Clients';
import Client from './components/clients/Client';
import ClientForm from './components/clients/ClientForm'
import AnonymousClientForm from './components/clients/AnonymousClientForm'

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
            <Nav>
              <IndexLinkContainer to={`/clients`}>
                <NavItem eventKey={1} href="#">Client Management System</NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to={`/services`}>
                <NavItem eventKey={2} href="#">Service Management System</NavItem>
              </IndexLinkContainer>
            </Nav>
            <Nav pullRight>
              <IndexLinkContainer to={`/login`}>
                <NavItem eventKey={3} href="#">Log In</NavItem>
              </IndexLinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path='/' component={Landing} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/login-pane' component={LoginPane} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/clients' component={Clients} />
        <Route exact path='/client/:id' component={Client} />
        <Route exact path='/clients/new' component={ClientForm} />
        <Route exact path='/clients/anonymous/new' component={AnonymousClientForm} />
        <Route exact path='/clients/edit' component={ClientForm} />
        <div className='footer'>
          <h5>
            <a href='http://csse.utoronto.ca/' target='_blank'>
              Centre for Social Services Engineering
            </a>, University of Toronto
          </h5>
        </div>
      </div>
    );
  }
}

export default App;
