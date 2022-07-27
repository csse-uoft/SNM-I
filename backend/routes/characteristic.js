const express = require('express');
const {fetchCharacteristic, fetchCharacteristics, createCharacteristic, updateCharacteristic, deleteCharacteristic} = require("../services/characteristics/characteristics");
const {getFieldTypes, getDataTypes, getAllClasses} = require("../services/characteristics");
const router = express.Router();
//TODO: implement backend functions from ../services/characteristics/characteristic.js

router.get('/characteristic/fieldTypes', getFieldTypes);
router.get('/characteristic/dataTypes', getDataTypes);
router.get('/characteristic/optionsFromClass', getAllClasses);

router.get('/characteristic/:id', fetchCharacteristic);
router.get('/characteristics', fetchCharacteristics);
router.post('/characteristic', createCharacteristic);
router.put('/characteristic', updateCharacteristic);
router.delete('/characteristic/delete/:id', deleteCharacteristic);


module.exports = router;