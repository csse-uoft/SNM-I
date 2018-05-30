import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// components
import Landing from './components/Landing';
import Login from './components/Login';
import LoginPane from './components/LoginPane';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Client from './components/clients/Client';
import ClientForm from './components/clients/ClientForm'
import AnonymousClientForm from './components/clients/AnonymousClientForm'
import Users from './components/Users';
import User from './components/users/User';
import UserForm from './components/users/UserForm'
import NeedForm from './components/client_needs/NeedForm'
import TopNavbar from './components/layouts/TopNavbar'
import Providers from './components/Providers.js';
import ProviderForm from './components/providers/ProviderTypePrompt.js'
import AddServicePrompt from './components/providers/AddServicePrompt.js'
import Resources from './components/Resources.js'
import IndividualProviderForm from './components/providers/IndividualProviderForm.js'
import OrganizationProviderForm from './components/providers/OrganizationProviderForm.js'
import ProviderProfile from './components/providers/ProviderProfile.js'
import EditIndividualProvider from './components/providers/EditProviderProfile.js'

// style
import './stylesheets/App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <TopNavbar />
        <Route exact path='/' component={Landing} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/login-pane' component={LoginPane} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/clients' component={Clients} />
        <Route exact path='/client/:id' component={Client} />
        <Route exact path='/clients/new' component={ClientForm} />
        <Route exact path='/clients/anonymous/new' component={AnonymousClientForm} />
        <Route exact path='/clients/:id/edit' component={ClientForm} />
        <Route exact path='/users' component={Users} />
        <Route exact path='/user/:id' component={User} />
        <Route exact path='/users/new' component={UserForm} />
        <Route exact path='/users/:id/edit' component={UserForm} />
        <Route exact path='/clients/:id/needs/new' component={NeedForm} />
        <Route exact path='/needs/:need_id/edit' component={NeedForm} />

        <Route exact path='/providers' component={ Providers} />
        <Route exact path='/providers/new' component={ProviderForm} />
        <Route exact path='/providers/new/add-service' component={AddServicePrompt} />
        <Route exact path='/services' component={Resources} />
        <Route exact path='/providers/new/individual' component={IndividualProviderForm} />
        <Route exact path='/providers/new/organization' component={OrganizationProviderForm} />
        <Route exact path='/provider/:id' component={ProviderProfile} />
        <Route exact path='/provider/:id/edit/individual' component={EditIndividualProvider} />
        <Route exact path='/provider/:id/edit/organization' component={EditIndividualProvider} />
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
