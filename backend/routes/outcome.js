const express = require('express');
const {createOutcome, fetchOutcomes, deleteOutcome, fetchOutcome, updateOutcome} = require("../services/outcome/outcome");
const router = express.Router();



router.post('/outcome', createOutcome);
router.get('/outcomes', fetchOutcomes);
router.delete('/outcome/:id', deleteOutcome);
router.get('/outcome/:id', fetchOutcome);
router.put('/outcome/:id', updateOutcome);



module.exports = router;
