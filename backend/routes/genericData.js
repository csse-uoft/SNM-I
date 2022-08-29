const express = require('express');
const {fetchSingleGeneric, createSingleGeneric, updateSingleGeneric, deleteSingleGeneric, advanceSearchGeneric} = require("../services/genericData");
const router = express.Router();

router.get('/generic/:option/:id', fetchSingleGeneric);
router.post('/generic/:option', createSingleGeneric);
router.put('/generic/:option/:id', updateSingleGeneric);
router.delete('/generic/:option/:id', deleteSingleGeneric);
router.put('/generic-advance-search/:option', advanceSearchGeneric);

module.exports = router;