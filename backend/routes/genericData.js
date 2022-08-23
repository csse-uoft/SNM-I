const express = require('express');
const {fetchSingleGeneric, createSingleGeneric, updateSingleGeneric} = require("../services/genericData");
const router = express.Router();

router.get('/generic/:option/:id', fetchSingleGeneric);
router.post('/generic/:option', createSingleGeneric)
router.put('/generic/:option/:id', updateSingleGeneric)

module.exports = router;