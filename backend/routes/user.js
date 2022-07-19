const express = require('express');

const {updateProfile, getCurrentUserProfile, checkCurrentPassword,
  updatePrimaryEmail, saveNewPassword, updateUserForm} = require("../services/users");
const {verifyChangePrimaryEmail} = require("../services/verifyUser");
const router = express.Router();

router.get('/user/profile/getCurrentUserProfile/:id/', getCurrentUserProfile);
router.post('/user/editProfile/:id', updateProfile);
router.post('/user/updateUserForm/:id', updateUserForm);
router.post('/user/editProfile/updatePrimaryEmail/:id', updatePrimaryEmail);
router.post('/user/resetPassword/checkCurrentPassword/:id', checkCurrentPassword);
router.post('/user/resetPassword/saveNewPassword/:id', saveNewPassword);
router.post('/user/updatePrimaryEmail', verifyChangePrimaryEmail);

module.exports = router;