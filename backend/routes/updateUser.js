const express = require('express');

const {firstEntryUpdate} = require("../services/updateUser")

const router = express.Router();


router.put('/user/firstEntry', firstEntryUpdate);

module.exports = router;