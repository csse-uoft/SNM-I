const express = require('express');
const {login, logout, getUserSecurityQuestions, checkUserSecurityQuestion} = require('../services/auth');


const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello from Express!!');
});

router.post('/login', login);
router.get('/login/securityQuestions/fetch', getUserSecurityQuestions)
router.post('/login/securityQuestions/check', checkUserSecurityQuestion)
router.post('/logout', logout);

module.exports = router;
