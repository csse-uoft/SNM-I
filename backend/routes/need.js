const express = require('express');
const {createCharacteristic, updateCharacteristic, deleteCharacteristic} = require("../services/characteristics/characteristics");
const {createNeed, fetchNeeds} = require("../services/need/need");
const router = express.Router();



router.post('/need', createNeed);
router.get('/needs', fetchNeeds);

router.post('/characteristic', createCharacteristic);
router.put('/characteristic/:id', updateCharacteristic);
router.delete('/characteristic/delete/:id', deleteCharacteristic);


module.exports = router;