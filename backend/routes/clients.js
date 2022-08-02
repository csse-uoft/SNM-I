const express = require('express');
const {createClient} = require("../services/client");
const router = express.Router();
//TODO: implement backend functions from ../services/client

router.post('/client', createClient);

module.exports = router;