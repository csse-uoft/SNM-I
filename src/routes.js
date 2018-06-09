import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

// components
import Landing from './components/Landing';
import Login from './components/Login';
import LoginPane from './components/LoginPane';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Client from './components/clients/Client';
import ClientForm from './components/clients/ClientForm'
import Users from './components/Users';
import User from './components/users/User';
import UserForm from './components/users/UserForm'
import NeedForm from './components/client_needs/NeedForm'
import Need from './components/client_needs/Need'
import PrivateRoute from './components/routes/PrivateRoute'
import AdminRoute from './components/routes/AdminRoute'
import Providers from './components/Providers';
import ProviderTypePrompt from './components/providers/ProviderTypePrompt'
import AddServicePrompt from './components/providers/AddServicePrompt'
import IndividualProviderForm from './components/providers/IndividualProviderForm'
import OrganizationProviderForm from './components/providers/OrganizationProviderForm'
import ProviderCSVUpload from './components/providers/UploadProviderCSV.js';
import ProviderProfile from './components/providers/ProviderProfile'
import EditProvider from './components/providers/EditProviderProfile'
import ProviderRatingForm from './components/providers/ProviderRatingForm.js';
import Services from './components/Services';
import Service from './components/services/Service';
import ServiceForm from './components/services/ServiceForm'

const routes = (
  <Switch>
    <Route exact path='/' component={Landing} />
    <Route path='/login' component={Login} />
    <Route path='/login-pane' component={LoginPane} />
    <PrivateRoute path='/dashboard' component={Dashboard} />

    <PrivateRoute path='/clients/:id/edit' component={ClientForm} />
    <PrivateRoute path='/clients/:id/needs/new' component={NeedForm} />
    <PrivateRoute path='/client/:id' component={Client} />
    <PrivateRoute path='/clients/new' component={ClientForm} />
    <PrivateRoute path='/clients' component={Clients} />

    <AdminRoute path='/users/:id/edit' component={UserForm} />
    <AdminRoute path='/user/:id' component={User} />
    <AdminRoute path='/users/new' component={UserForm} />
    <AdminRoute path='/users' component={Users} />

    <PrivateRoute path='/needs/:need_id/edit' component={NeedForm} />
    <PrivateRoute path='/needs/:need_id' component={Need} />

    <PrivateRoute path='/provider/:id/rate' component={ProviderRatingForm} />
    <PrivateRoute path='/providers/new/add-service' component={AddServicePrompt} />
    <PrivateRoute path='/providers/new/individual' component={IndividualProviderForm} />
    <PrivateRoute path='/providers/new/organization' component={OrganizationProviderForm} />
    <PrivateRoute path='/providers/new/upload' component={ProviderCSVUpload} />
    <PrivateRoute path='/providers/new' component={ProviderTypePrompt} />
    <PrivateRoute path='/provider/:id/edit/individual' component={EditProvider} />
    <PrivateRoute path='/provider/:id/edit/organization' component={EditProvider} />
    <PrivateRoute path='/provider/:id' component={ProviderProfile} />
    <PrivateRoute path='/providers' component={Providers} />

    <PrivateRoute path='/services/:id/edit' component={ServiceForm} />
    <PrivateRoute path='/service/:id' component={Service} />
    <PrivateRoute path='/services/new' component={ServiceForm} />
    <PrivateRoute path='/services' component={Services} />
  </Switch>
)

export default routes;
