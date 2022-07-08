const express = require('express');

const { fetchSecurityQuestionsByEmail, checkSecurityQuestion} = require("../services/securityQuestions")
const {sendVerificationEmail} = require("../services/email");
const {verifyUserForgotPassword} = require("../services/verifyUser");
const {saveNewPassword} = require("../services/users");
const router = express.Router();

router.put('/forgotPassword/securityQuestions/fetch', fetchSecurityQuestionsByEmail)
router.post('/forgotPassword/securityQuestions/check', checkSecurityQuestion)
router.post('/forgotPassword/sendVerificationEmail', sendVerificationEmail)
router.post('/forgotPassword/resetPassword/verify', verifyUserForgotPassword)
router.post('/forgotPassword/resetPassword/saveNewPassword/', saveNewPassword)

module.exports = router;