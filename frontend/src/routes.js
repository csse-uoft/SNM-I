import React from 'react';
import {Route, Routes} from 'react-router-dom';

// components
import Landing from './components/Landing';
// import Login from './components/login/Login';
import LoginPane from './components/login/LoginPane';
import Dashboard from './components/Dashboard';
import changePrimaryEmail from './components/userProfile/changePrimaryEmail';
import Clients from './components/Clients';
import Client from './components/clients/Client';
import ClientForm from './components/clients/ClientForm';
import Users from './components/Users';
import User from './components/users/User';
import UserForm from './components/users/UserForm';
import UserInvite from './components/registration/UserInvite';
import ResetPassword from './components/userProfile/UserResetPassword';
import UserResetSecurityQuestions from "./components/userProfile/UserResetSecurityQuestions";
import EmailConfirm from './components/emailConfirm';
import UserProfile from './components/userProfile/Profile';
import UpdateUserProfile from './components/userProfile/EditProfile';
import AddEditNeed from "./components/need/addEditNeed";
// import NeedForm from './components/client_needs/NeedForm'
// import Need from './components/client_needs/Need'
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import Providers from './components/Providers';
import AddServicePrompt from './components/providers/AddServicePrompt';
import AddProgramPrompt from './components/providers/AddProgramPrompt';
import ProviderForm from './components/providers/ProviderForm2';
import ProviderProfile from './components/providers/ProviderProfile';
import ProviderRatingForm from './components/providers/ProviderRatingForm.js';
import Services from './components/Services';
import Service from './components/services/Service';
import Programs from './components/Programs';
import Program from './components/programs/Program';
// import ServiceForm from './components/services/ServiceForm'
import ServiceForm from './components/services/ServiceForm2';
import Appointments from "./components/Appointments";
import AppointmentForm from "./components/appointments/AppointmentForm";
import AdminLogs from './components/AdminLogs';
import Eligibilities from './components/additionalFIelds/Eligibilities';
import ManageForms from './components/settings/ManageForms';
import ManageFormFields from './components/settings/ManageFormFields';
import UserFirstEntry from "./components/registration/UserFirstEntry";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import ForgotPasswordResetPassword from "./components/forgotPassword/ResetPassword";
import DoubleAuth from "./components/login/DoubleAuth";
import EditUserForm from "./components/users/EditUserForm";
import AddEditCharacteristic from "./components/characteristics/AddEditCharacteristic";
import Characteristics from "./components/characteristics/Characteristics";
import AddEditQuestion from "./components/questions/AddEditQuestion";
import Questions from './components/questions/Questions';
import VisualizeClient from './components/clients/VisualizeClient';
import ClientSearch from "./components/clients/ClientSearch";
import VisualizeServiceProvider from './components/serviceProviders/visualizaServiceProvider';
import VisualizeProgramProvider from './components/programProviders/visualizaProgramProvider';
import VisualizeService from "./components/services/visualizeService";
import VisualizeProgram from "./components/programs/visualizeProgram";
import VisualizeAppointment from "./components/appointment/visualizeAppointment";
import Needs from "./components/need/needs";
import AddEditNeedSatisfier from "./components/needSatisfier/addEditNeedSatisfier";
import NeedSatisfiers from "./components/needSatisfier/needSatisfiers";
import ServiceOccurrences from "./components/ServiceOccurrences";
import ServiceOccurrenceForm from "./components/serviceOccurrence/ServiceOccurrence";
import ReferralForm from "./components/referrals/ReferralForm";
import Referrals from "./components/referrals/Referrals";
import ServiceRegistrationForm from "./components/serviceRegistration/ServiceRegistrationForm";
import ServiceRegistrations from "./components/serviceRegistration/ServiceRegistrations";
import ServiceProvisionForm from "./components/serviceProvision/serviceProvisionForm";
import ServiceProvisions from "./components/serviceProvision/serviceProvisions";
import ProgramRegistrationForm from "./components/programRegistration/ProgramRegistrationForm";
import ProgramRegistrations from "./components/programRegistration/ProgramRegistrations";
import ProgramProvisionForm from "./components/programProvision/programProvisionForm";
import ProgramProvisions from "./components/programProvision/programProvisions";
import NeedOccurrenceForm from "./components/needOccurrence/needOccurrenceForm";
import NeedOccurrences from "./components/needOccurrence/NeedOccurrences";
import ClientAssessment from './components/clientAssessment/ClientAssesment';
import ClientAssessmentForm from './components/clientAssessment/ClientAssessmentForm';
const routes = (
  <Routes>
    <Route exact path="/" element={<Landing/>}/>
    {/*<Route path='/login' element={Login}/>}/>*/}
    <Route path="/email-confirm" element={<EmailConfirm/>}/>
    <Route path="/login/doubleAuth" element={<DoubleAuth/>}/>
    <Route path="/login" element={<LoginPane/>}/>
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="/update-primary-email/:token" element={<changePrimaryEmail/>}/>
    <Route path="/dashboard" element={<PrivateRoute element={Dashboard}/>}/>

    <Route path="/verify/:token" element={<UserFirstEntry/>}/>}/>
    <Route path="/resetPassword/:token" element={<PrivateRoute element={ForgotPasswordResetPassword}/>}/>

    <Route path="/clients/:id/edit" element={<ClientForm/>}/>}/>
    {/*<PrivateRoute path='/clients/:id/needs/new' element={NeedForm}/>}/>*/}
    <Route path="/clients/new" element={<PrivateRoute element={ClientForm}/>}/>
    <Route path="/clients/advance-search" element={<PrivateRoute element={ClientSearch}/>}/>
    <Route path="/clients/:id" element={<PrivateRoute element={VisualizeClient}/>}/>
    <Route path="/clients" element={<PrivateRoute element={Clients}/>}/>
    <Route path="/profile/:id/edit" element={<PrivateRoute element={UpdateUserProfile}/>}/>
    <Route path="/profile/:id" element={<PrivateRoute element={UserProfile}/>}/>
    <Route path="/users/reset-password/:id" element={<PrivateRoute element={ResetPassword}/>}/>
    <Route path="/users/reset-securityQuestions/:id" element={<PrivateRoute element={UserResetSecurityQuestions}/>}/>

    <Route path="/clientAssessment/:id/edit" element={<PrivateRoute element={ClientAssessmentForm}/>}/>
    <Route path="/clientAssessment/new" element={<PrivateRoute element={ClientAssessmentForm}/>}/>
    <Route path="/clientAssessment" element={<PrivateRoute element={ClientAssessment}/>}/>

    <Route path="/users/:id/edit" element={<AdminRoute element={EditUserForm}/>}/>
    <Route path="/users/new" element={<AdminRoute element={UserForm}/>}/>
    <Route path="/users/invite" element={<AdminRoute element={UserInvite}/>}/>
    <Route path="/users/:id" element={<AdminRoute element={User}/>}/>
    <Route path="/users" element={<AdminRoute element={Users}/>}/>
    <Route path="/admin-logs" element={<AdminRoute element={AdminLogs}/>}/>


    {/*<PrivateRoute path='/needs/:need_id/edit' element={NeedForm}/>}/>*/}
    {/*<PrivateRoute path='/needs/:need_id' element={Need}/>}/>*/}

    <Route path="/providers/:id/rate" element={<PrivateRoute element={ProviderRatingForm}/>}/>
    <Route path="/providers/new/add-service" element={<PrivateRoute element={AddServicePrompt}/>}/>
    <Route path="/providers/new/add-program" element={<PrivateRoute element={AddProgramPrompt}/>}/>
    <Route path="/providers/:formType/new" element={<PrivateRoute element={ProviderForm}/>}/>
    <Route path="/providers/:formType/:id" element={<PrivateRoute element={VisualizeServiceProvider}/>}/>
    <Route path="/program-providers/:formType/:id" element={<PrivateRoute element={VisualizeProgramProvider}/>}/>
    <Route path="/providers/:formType/:id/edit/" element={<PrivateRoute element={ProviderForm}/>}/>
    <Route path="/program-providers/:formType/:id/edit/" element={<PrivateRoute element={ProgramProviderForm}/>}/>
    <Route path="/providers/:id" element={<PrivateRoute element={ProviderProfile}/>}/>
    <Route path="/program-providers/:id" element={<PrivateRoute element={ProgramProviderProfile}/>}/>
    <Route path="/providers" element={<PrivateRoute element={Providers}/>}/>
    <Route path="/program-providers" element={<PrivateRoute element={ProgramProviders}/>}/>

    <Route path="/services/:id/edit" element={<PrivateRoute element={ServiceForm}/>}/>
    <Route path="/services/new" element={<PrivateRoute element={ServiceForm}/>}/>
    <Route path="/services/:id" element={<PrivateRoute element={VisualizeService}/>}/>
    <Route path="/services" element={<PrivateRoute element={Services}/>}/>

    <Route path="/programs/:id/edit" element={<PrivateRoute element={ProgramForm}/>}/>
    <Route path="/programs/new" element={<PrivateRoute element={ProgramForm}/>}/>
    <Route path="/programs/:id" element={<PrivateRoute element={VisualizeProgram}/>}/>
    <Route path="/programs" element={<PrivateRoute element={Programs}/>}/>

    <Route path="/referrals/:id/edit" element={<PrivateRoute element={ReferralForm}/>}/>
    <Route path="/referrals/new" element={<PrivateRoute element={ReferralForm}/>}/>
    {/*<Route path="/referrals/:id" element={<PrivateRoute element={VisualizeService}/>}/>*/}
    <Route path="/referrals" element={<PrivateRoute element={Referrals}/>}/>

    <Route path="/serviceRegistrations/:id/edit" element={<PrivateRoute element={ServiceRegistrationForm}/>}/>
    <Route path="/serviceRegistrations/new" element={<PrivateRoute element={ServiceRegistrationForm}/>}/>
    {/*<Route path="/serviceRegistrations/:id" element={<PrivateRoute element={VisualizeService}/>}/>*/}
    <Route path="/serviceRegistrations" element={<PrivateRoute element={ServiceRegistrations}/>}/>

    <Route path="/programRegistrations/:id/edit" element={<PrivateRoute element={ProgramRegistrationForm}/>}/>
    <Route path="/programRegistrations/new" element={<PrivateRoute element={ProgramRegistrationForm}/>}/>
    {/*<Route path="/programRegistrations/:id" element={<PrivateRoute element={VisualizeProgram}/>}/>*/}
    <Route path="/programRegistrations" element={<PrivateRoute element={ProgramRegistrations}/>}/>

    <Route path="/serviceOccurrences" element={<PrivateRoute element={ServiceOccurrences}/>}/>
    <Route path="/serviceOccurrence/new" element={<PrivateRoute element={ServiceOccurrenceForm}/>}/>
    <Route path="/serviceOccurrence/:id/edit" element={<PrivateRoute element={ServiceOccurrenceForm}/>}/>

    <Route path="/referrals" element={<PrivateRoute element={Referrals}/>}/>

    <Route path="/appointments/:id/edit" element={<PrivateRoute element={AppointmentForm}/>}/>
    <Route path="/appointments/:id" element={<PrivateRoute element={VisualizeAppointment}/>}/>
    <Route path="/appointments/new" element={<PrivateRoute element={AppointmentForm}/>}/>
    <Route path="/appointments" element={<PrivateRoute element={Appointments}/>}/>

    <Route path="/needOccurrences/:id/edit" element={<PrivateRoute element={NeedOccurrenceForm}/>}/>
    {/*<Route path="/needOccurrences/:id" element={<PrivateRoute element={VisualizeAppointment}/>}/>*/}
    <Route path="/needOccurrences/new" element={<PrivateRoute element={NeedOccurrenceForm}/>}/>
    <Route path="/needOccurrences" element={<PrivateRoute element={NeedOccurrences}/>}/>

    <Route path="/serviceProvisions/:id/edit" element={<PrivateRoute element={ServiceProvisionForm}/>}/>
    {/*<Route path="/serviceProvisions/:id" element={<PrivateRoute element={VisualizeAppointment}/>}/>*/}
    <Route path="/serviceProvisions/new" element={<PrivateRoute element={ServiceProvisionForm}/>}/>
    <Route path="/serviceProvisions" element={<PrivateRoute element={ServiceProvisions}/>}/>

    <Route path="/programProvisions/:id/edit" element={<PrivateRoute element={ProgramProvisionForm}/>}/>
    {/*<Route path="/programProvisions/:id" element={<PrivateRoute element={VisualizeAppointment}/>}/>*/}
    <Route path="/programProvisions/new" element={<PrivateRoute element={ProgramProvisionForm}/>}/>
    <Route path="/programProvisions" element={<PrivateRoute element={ProgramProvisions}/>}/>

    <Route path="/eligibility-criteria" element={<PrivateRoute element={Eligibilities}/>}/>

    <Route path="/characteristics" element={<AdminRoute element={Characteristics}/>}/>
    {/*this for edit*/}
    <Route path={'/characteristic/:id/:option'} element={<AdminRoute element={AddEditCharacteristic}/>}/>
    {/*this for add  */}
    <Route path={'/characteristic/:option'} element={<AdminRoute element={AddEditCharacteristic}/>}/>

    <Route path={'/question/:id/:option'} element={<AdminRoute element={AddEditQuestion}/>}/>
    <Route path={'/question/:option'} element={<AdminRoute element={AddEditQuestion}/>}/>
    <Route path={'/questions'} element={<AdminRoute element={Questions}/>}/>

    <Route path={'/need/:id/:option'} element={<AdminRoute element={AddEditNeed}/>}/>
    <Route path={'/need/:option'} element={<AdminRoute element={AddEditNeed}/>}/>
    <Route path={'/needs'} element={<AdminRoute element={Needs}/>}/>

    <Route path={'/needSatisfier/:id/:option'} element={<AdminRoute element={AddEditNeedSatisfier}/>}/>
    <Route path={'/needSatisfier/:option'} element={<AdminRoute element={AddEditNeedSatisfier}/>}/>
    <Route path={'/needSatisfiers'} element={<AdminRoute element={NeedSatisfiers}/>}/>

    <Route exact path="/settings/manage-forms/" element={<AdminRoute element={ManageForms}/>}/>
    <Route exact path="/settings/manage-forms/:formType" element={<AdminRoute element={ManageForms}/>}/>

    {/*:formType could be `client`, 'organization', ...*/}
    {/*:method could be `edit` or `new`*/}
    <Route exact path="/settings/forms/" element={<AdminRoute element={ManageFormFields}/>}/>
    <Route exact path="/settings/forms/:formType/:method" element={<AdminRoute element={ManageFormFields}/>}/>
    <Route exact path="/settings/forms/:formType/:method/:formId" element={<AdminRoute element={ManageFormFields}/>}/>
  </Routes>
);

export default routes;
