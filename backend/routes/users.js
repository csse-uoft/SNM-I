const express = require('express');
const {fetchUsers, getUserProfileById} = require("../services/users");
const router = express.Router();


router.get('/users', fetchUsers);
router.get('/users/getUserProfileById/:id', getUserProfileById)

module.exports = router;
