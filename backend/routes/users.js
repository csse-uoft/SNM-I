const express = require('express');

const {updateProfile, getCurrentUserProfile, checkCurrentPassword,
  updatePrimaryEmail, saveNewPassword} = require("../services/users");
const {verifyChangePrimaryEmail} = require("../services/verifyUser");
const router = express.Router();

router.get('/users/profile/getCurrentUserProfile/:id/', getCurrentUserProfile);
router.post('/users/editProfile/:id', updateProfile);
router.post('/users/editProfile/updatePrimaryEmail/:id', updatePrimaryEmail);
router.post('/users/resetPassword/checkCurrentPassword/:id', checkCurrentPassword);
router.post('/users/resetPassword/saveNewPassword/:id', saveNewPassword);
router.post('/users/updatePrimaryEmail', verifyChangePrimaryEmail);

module.exports = router;