const express = require('express');

const {updateProfile, getCurrentUserProfile, checkCurrentPassword,
  updatePrimaryEmail, saveNewPassword} = require("../services/users");
const {verifyChangePrimaryEmail} = require("../services/verifyUser");
const router = express.Router();

router.get('/profile/:id', getCurrentUserProfile);
router.post('/profile/:id/edit', updateProfile);
router.post('/profile/:id/edit/updatePrimaryEmail', updatePrimaryEmail);
router.post('/users/reset-password/:id', checkCurrentPassword);
router.post('/users/reset-password/:id/update', saveNewPassword);
router.post('/update-primary-email', verifyChangePrimaryEmail);

module.exports = router;