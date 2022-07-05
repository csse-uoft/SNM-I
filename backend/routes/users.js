const express = require('express');

const {updateProfile, getCurrentUserProfile, fetchSecurityQuestionsByEmail} = require("../services/users")
const router = express.Router();

router.get('/profile/:id', getCurrentUserProfile);
router.post('/profile/:id', updateProfile);
router.get('/securityQuestions/email', fetchSecurityQuestionsByEmail)

module.exports = router;