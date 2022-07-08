const express = require('express');

// const {login, logout} = require("../services/auth");
const {inviteNewUser} = require("../services/invite")
const {verifyUser} = require("../services/firstEntry");

const router = express.Router();

/* GET home page. */

router.post('/register/invite', inviteNewUser);
router.post('/register/firstEntry/verify', verifyUser);

module.exports = router;