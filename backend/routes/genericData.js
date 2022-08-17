const express = require('express');
const {fetchSingleGeneric, createSingleGeneric} = require("../services/genericData");
const router = express.Router();

router.get('/generic/:option/:id', fetchSingleGeneric);
router.post('/generic/:option', createSingleGeneric)

module.exports = router;