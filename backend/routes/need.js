const express = require('express');
const {createCharacteristic, updateCharacteristic,} = require("../services/characteristics/characteristics");
const {createNeed, fetchNeeds, deleteNeed, fetchNeed} = require("../services/need/need");
const router = express.Router();



router.post('/need', createNeed);
router.get('/needs', fetchNeeds);
router.delete('/need/:id', deleteNeed);
router.get('/need/:id', fetchNeed)

router.post('/characteristic', createCharacteristic);
router.put('/characteristic/:id', updateCharacteristic);



module.exports = router;