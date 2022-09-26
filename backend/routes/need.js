const express = require('express');
const {fetchCharacteristic, fetchCharacteristics, createCharacteristic, updateCharacteristic, deleteCharacteristic} = require("../services/characteristics/characteristics");
const {createNeed} = require("../services/need/need");
const router = express.Router();



router.post('/need', createNeed);
router.get('/characteristics', fetchCharacteristics);

router.post('/characteristic', createCharacteristic);
router.put('/characteristic/:id', updateCharacteristic);
router.delete('/characteristic/delete/:id', deleteCharacteristic);


module.exports = router;