const express = require('express');
const {createClient} = require("../services/client");
const router = express.Router();

router.post('/client', createClient);



module.exports = router;