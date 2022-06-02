const express = require('express');
const {registrationService, loginService} = require('../services/user');


const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello from Express!!');
});


module.exports = router;
