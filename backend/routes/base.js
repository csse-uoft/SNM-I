const express = require('express');
const {login} = require('../services/login');


const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello from Express!!');
});

router.post('/login', login);


module.exports = router;
