const express = require('express');
const {fetchSingleGeneric} = require("../services/genericData");
const router = express.Router();

router.get('/generic/:option/:id', fetchSingleGeneric);


module.exports = router;