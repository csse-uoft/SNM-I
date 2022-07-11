const express = require('express');
const {fetchUsers} = require("../services/users");
const router = express.Router();


router.get('/users', fetchUsers)

module.exports = router;
