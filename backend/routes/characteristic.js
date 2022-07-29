const express = require('express');
const {fetchCharacteristic, fetchCharacteristics, createCharacteristic, updateCharacteristic, deleteCharacteristic} = require("../services/characteristics/characteristics");
const {getFieldTypes, getDataTypes, getAllClasses, fetchCharacteristicsWithDetails} = require("../services/characteristics");
const router = express.Router();
//TODO: implement backend functions from ../services/characteristics/characteristics.js

router.get('/characteristic/fieldTypes', getFieldTypes);
router.get('/characteristic/dataTypes', getDataTypes);
router.get('/characteristic/optionsFromClass', getAllClasses);
router.get('/characteristics/details', fetchCharacteristicsWithDetails);

router.get('/characteristic/:id', fetchCharacteristic);
router.get('/characteristics', fetchCharacteristics);
router.post('/characteristic', createCharacteristic);
router.put('/characteristic/:id', updateCharacteristic);
router.delete('/characteristic/delete/:id', deleteCharacteristic);


module.exports = router;