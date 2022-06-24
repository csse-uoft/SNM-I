const express = require('express');

const {updateProfile, getCurrentUserProfile} = require("../services/users")
const router = express.Router();

router.get('/my-profile', getCurrentUserProfile)
router.post('/profile', updateProfile);

module.exports = router;