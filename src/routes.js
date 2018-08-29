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
import AddServicePrompt from './components/providers/AddServicePrompt'
import ProviderForm from './components/providers/ProviderForm'
import ProviderProfile from './components/providers/ProviderProfile'
import ProviderRatingForm from './components/providers/ProviderRatingForm.js';
import Services from './components/Services';
import Service from './components/services/Service';
import ServiceForm from './components/services/ServiceForm'
import Goods from './components/Goods';
import Good from './components/goods/Good';
import GoodForm from './components/goods/GoodForm'
import AdminLogs from './components/AdminLogs';
import Reporting from './components/Reporting';
import Eligibilities from './components/Eligibilities';
import EligibilityForm from './components/eligibilities/EligibilityForm'
import ManageClientFields from './components/settings/ManageClientFields';
import ManageProviderFields from './components/settings/ManageProviderFields';

const routes = (
  <Switch>
    <Route exact path='/' component={Landing} />
    <Route path='/login' component={Login} />
    <Route path='/login-pane' component={LoginPane} />
    <PrivateRoute path='/dashboard' component={Dashboard} />

    <PrivateRoute path='/clients/:id/edit' component={ClientForm} />
    <PrivateRoute path='/clients/:id/needs/new' component={NeedForm} />
    <PrivateRoute path='/clients/new' component={ClientForm} />
    <PrivateRoute path='/clients/:id' component={Client} />
    <PrivateRoute path='/clients' component={Clients} />

    <AdminRoute path='/users/:id/edit' component={UserForm} />
    <AdminRoute path='/users/new' component={UserForm} />
    <AdminRoute path='/users/:id' component={User} />
    <AdminRoute path='/users' component={Users} />
    <AdminRoute path='/admin-logs' component={AdminLogs} />

    <PrivateRoute path='/needs/:need_id/edit' component={NeedForm} />
    <PrivateRoute path='/needs/:need_id' component={Need} />

    <PrivateRoute path='/provider/:id/rate' component={ProviderRatingForm} />
    <PrivateRoute path='/providers/new/add-service' component={AddServicePrompt} />
    <PrivateRoute path='/providers/:formType/new' component={ProviderForm} />
    <PrivateRoute path='/provider/:id/edit/' component={ProviderForm} />
    <PrivateRoute path='/provider/:id' component={ProviderProfile} />
    <PrivateRoute path='/providers' component={Providers} />

    <PrivateRoute path='/services/:id/edit' component={ServiceForm} />
    <PrivateRoute path='/service/:id' component={Service} />
    <PrivateRoute path='/services/new' component={ServiceForm} />
    <PrivateRoute path='/services' component={Services} />

    <PrivateRoute path='/goods/:id/edit' component={GoodForm} />
    <PrivateRoute path='/good/:id' component={Good} />
    <PrivateRoute path='/goods/new' component={GoodForm} />
    <PrivateRoute path='/goods' component={Goods} />

    <PrivateRoute path='/reporting' component={Reporting} />

    <PrivateRoute path='/eligibility-criteria/:id/edit' component={EligibilityForm} />
    <PrivateRoute path='/eligibility-criteria/new' component={EligibilityForm} />
    <PrivateRoute path='/eligibility-criteria' component={Eligibilities} />

    <AdminRoute path='/settings/manage-client-fields' component={ManageClientFields} />
    <AdminRoute path='/settings/manage-provider-fields' component={ManageProviderFields} />
  </Switch>
)

export default routes;
