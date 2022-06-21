const express = require('express');

// const {login, logout} = require("../services/auth");
const {invite, inviteNewUser} = require("../services/invite")

const router = express.Router();

/* GET home page. */

router.post('/users/invite', inviteNewUser);

module.exports = router;