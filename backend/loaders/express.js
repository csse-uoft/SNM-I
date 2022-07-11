const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const cors = require('cors');

const {baseRoute, registerRoute, userRoute, forgotPasswordRoute} = require('../routes');
const {authMiddleware, errorHandler} = require('../services/middleware');


const config = require('../config');
const {getCurrentUserProfile} = require("../services/users");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
  credentials: true,
  origin: config.allowedOrigins
}));
app.use(cookieParser());
app.use(cookieSession(config.cookieSession));

app.use('/api', baseRoute);
app.use('/api', registerRoute);
app.use('/api', forgotPasswordRoute);
app.use('/api', authMiddleware('Authentication Required'));

app.use('/api', userRoute);

require('../services/user').initUserAccounts();

app.use(errorHandler);

process.env.TZ = 'America/Toronto'

module.exports = app;
