const express = require('express');
const {createQuestionOcc} = require("../services/client");
const router = express.Router();
//TODO: implement backend functions from ../services/client

router.post('questionOcc', createQuestionOcc);
module.exports = router;