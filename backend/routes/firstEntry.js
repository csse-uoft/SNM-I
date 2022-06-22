const {verifyUser} = require("../services/firstEntry")
const express = require("express");

const router = express.Router();


router.post('/users/firstEntry/verify', verifyUser);

module.exports = router;