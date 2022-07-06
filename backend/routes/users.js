const express = require('express');

const {updateProfile, getCurrentUserProfile, checkCurrentPassword} = require("../services/users");
const router = express.Router();

router.get('/profile/:id', getCurrentUserProfile);
router.post('/profile/:id/edit', updateProfile);
router.post('/users/reset-password/:id', checkCurrentPassword);

module.exports = router;