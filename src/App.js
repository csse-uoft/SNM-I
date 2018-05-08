import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';
import { serverHost } from './store/defaults.js';

// components
import Dashboard from './components/Dashboard.js';
import Clients from './components/Clients.js';
import Resources from './components/Resources.js';
import Providers from './components/Providers.js';
import ClientNeeds from './components/ClientNeeds.js';
import Goods from './components/Goods.js';

// style 
import './stylesheets/App.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class App extends Component {
  render() {
    const clientsReportPath = serverHost + '/clients.csv',
          needsReportPath = serverHost + '/needs.csv'

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
              <IndexLinkContainer to={`/`}>
                <NavItem eventKey={1} href="#">Dashboard</NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to={`/clients/`}>
                <NavItem eventKey={2} href="#">Clients</NavItem>
              </IndexLinkContainer>
              <NavDropdown eventKey={6} title = "Resources" id="basic-nav-dropdown2">
                <MenuItem eventKey={6.1} href="/resources/">Services</MenuItem>
                <MenuItem eventKey={6.2} href="/goods/">Goods</MenuItem>
              </NavDropdown>
              <IndexLinkContainer to={`/providers/`}>
                <NavItem eventKey={4} href="#">Providers</NavItem>
              </IndexLinkContainer> 
            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={5} title="Reports" id="basic-nav-dropdown">
                <MenuItem eventKey={5.1} href={clientsReportPath}>Clients</MenuItem>
                <MenuItem eventKey={5.2} href={needsReportPath}>Client Needs</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path='/' component={Dashboard}/>
        <Route exact path='/clients/' component={Clients}/>
        <Route exact path='/resources/' component={Resources}/>
        <Route exact path='/goods/' component={Goods}/>
        <Route exact path='/providers/' component={Providers}/>
        <Route exact path='/client/:id' component={ClientNeeds}/>
      </div>
    );
  }
}

export default App;
