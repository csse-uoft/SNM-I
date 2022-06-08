const express = require('express');
const {login, logout} = require('../services/auth');


const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello from Express!!');
});

router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
