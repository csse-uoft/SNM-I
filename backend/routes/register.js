const express = require('express');

// const {login, logout} = require("../services/auth");
const {inviteNewUser} = require("../services/userAccount/invite")
const {verifyUser} = require("../services/userAccount/firstEntry");
const {firstEntryUpdate} = require("../services/userAccount/updateUser");

const router = express.Router();

/* GET home page. */

router.post('/register/invite', inviteNewUser);
router.post('/register/firstEntry/verify', verifyUser);
router.put('/register/firstEntry/update', firstEntryUpdate);

module.exports = router;