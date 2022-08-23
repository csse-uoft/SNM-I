const express = require('express');
const {fetchSingleGeneric, createSingleGeneric, updateSingleGeneric, deleteSingleGeneric} = require("../services/genericData");
const router = express.Router();

router.get('/generic/:option/:id', fetchSingleGeneric);
router.post('/generic/:option', createSingleGeneric)
router.put('/generic/:option/:id', updateSingleGeneric)
router.delete('/generic/:option/:id', deleteSingleGeneric)

module.exports = router;