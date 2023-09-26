const express = require('express');

const {matchFromClientHandler} = require("../services/matching");
const router = express.Router();

router.get('/matching/client/:clientId', matchFromClientHandler);

module.exports = router;
