const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const cors = require('cors');

const {
  baseRoute, registerRoute, userRoute, forgotPasswordRoute, usersRoute, clientsRoute,
  characteristicRoute, questionRoute, dynamicFormRoute, genericRoute, advancedSearchRoute, serviceProviderRoute,needRoute,
  needSatisfierRoute, internalTypeRoute
} = require('../routes');
const {authMiddleware, errorHandler} = require('../services/middleware');


const config = require('../config');
const {initUserAccounts} = require('../services/userAccount/user');
const {initFieldTypes, initPredefinedCharacteristics, initPredefinedInternalType} = require('../services/characteristics');
const {initStreetTypes, initStreetDirections} = require('../services/address');

const app = express();

// Trust our reverse proxy
app.set('trust proxy', ['::ffff:172.31.12.233', '172.31.12.233']);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
  credentials: true,
  origin: config.allowedOrigins
}));
app.use(cookieParser());
app.use(cookieSession(config.cookieSession));

// Public routes
// Generate token for login (for frontend is in the cookie)
app.use('/api', baseRoute);
app.use('/api', registerRoute);
app.use('/api', forgotPasswordRoute);

// Authentication required for the below routes
app.use('/api', authMiddleware('Authentication Required'));
// TODO: Check authorization

// Private routes
app.use('/api', userRoute);
app.use('/api', usersRoute);
app.use('/api', characteristicRoute);
app.use('/api', questionRoute);
app.use('/api', dynamicFormRoute);
app.use('/api', genericRoute);
app.use('/api', advancedSearchRoute);
app.use('/api', serviceProviderRoute);
app.use('/api', needRoute);
app.use('/api', needSatisfierRoute);
app.use('/api', internalTypeRoute);


initUserAccounts();
initFieldTypes().then(() => {
  initPredefinedCharacteristics();
  initPredefinedInternalType();
});
initStreetTypes();
initStreetDirections();

app.use(errorHandler);

process.env.TZ = 'America/Toronto';

module.exports = app;
