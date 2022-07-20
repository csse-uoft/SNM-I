const express = require('express');

const { fetchSecurityQuestionsByEmail, checkSecurityQuestion} = require("../services/userAccount/securityQuestions")
const {sendVerificationEmail} = require("../services/userAccount/email");
const {verifyUserForgotPassword} = require("../services/userAccount/verifyUser");
const {saveNewPassword} = require("../services/userAccount/users");
const router = express.Router();

router.put('/forgotPassword/securityQuestions/fetch', fetchSecurityQuestionsByEmail)
router.post('/forgotPassword/securityQuestions/check', checkSecurityQuestion)
router.post('/forgotPassword/sendVerificationEmail', sendVerificationEmail)
router.post('/forgotPassword/resetPassword/verify', verifyUserForgotPassword)
router.post('/forgotPassword/resetPassword/saveNewPassword/', saveNewPassword)

module.exports = router;