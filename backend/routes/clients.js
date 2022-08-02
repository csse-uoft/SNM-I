const express = require('express');
const {createQuestionOcc, createClient} = require("../services/client");
const router = express.Router();
//TODO: implement backend functions from ../services/client

router.post('/questionOcc', createQuestionOcc);
router.post('/client', createClient);

module.exports = router;