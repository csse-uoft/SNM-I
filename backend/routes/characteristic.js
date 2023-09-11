const express = require('express');
const {
  getFieldTypes, getDataTypes, getAllClasses, fetchCharacteristicsWithDetails,
  fetchCharacteristic, fetchCharacteristics, createCharacteristic, updateCharacteristic, deleteCharacteristic,
  getConnectedCharacteristics
} = require("../services/characteristics");

const router = express.Router();


router.get('/characteristic/fieldTypes', getFieldTypes);
router.get('/characteristic/dataTypes', getDataTypes);
router.get('/characteristic/optionsFromClass', getAllClasses);
router.get('/characteristics/details', fetchCharacteristicsWithDetails);

router.get('/characteristic/:id', fetchCharacteristic);
router.get('/characteristics', fetchCharacteristics);

router.post('/characteristic', createCharacteristic);
router.put('/characteristic/:id', updateCharacteristic);
router.delete('/characteristic/delete/:id', deleteCharacteristic);
router.get('/characteristic/graph/:startNodeURI', getConnectedCharacteristics);


module.exports = router;