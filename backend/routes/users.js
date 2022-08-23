const express = require('express');
const {fetchUsers, getUserProfileById} = require("../services/userAccount/users");
const router = express.Router();


router.get('/users', fetchUsers);
router.get('/users/getUserProfileById/:id/', getUserProfileById)

module.exports = router;
