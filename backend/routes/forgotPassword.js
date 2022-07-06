const express = require('express');

const { fetchSecurityQuestionsByEmail, checkSecurityQuestion} = require("../services/securityQuestions")
const {sendVerificationEmail} = require("../services/email");
const {verifyUserForgotPassword} = require("../services/verifyUser");
const router = express.Router();

router.put('/securityQuestions/email', fetchSecurityQuestionsByEmail)
router.post('/checkSecurityQuestion', checkSecurityQuestion)
router.post('/sendVerificationEmail', sendVerificationEmail)
router.post('/resetPassword/verify', verifyUserForgotPassword)

module.exports = router;