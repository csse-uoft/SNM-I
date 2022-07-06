const express = require('express');

const { fetchSecurityQuestionsByEmail, checkSecurityQuestion} = require("../services/securityQuestions")
const {sendVerificationEmail} = require("../services/email");
const router = express.Router();

router.put('/securityQuestions/email', fetchSecurityQuestionsByEmail)
router.post('/checkSecurityQuestion', checkSecurityQuestion)
router.post('/sendVerificationEmail', sendVerificationEmail)

module.exports = router;