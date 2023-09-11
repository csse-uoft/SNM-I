const express = require('express');
const {createNeed, fetchNeeds, deleteNeed, fetchNeed, updateNeed, getConnectedNeeds} = require("../services/need/need");
const router = express.Router();



router.post('/need', createNeed);
router.get('/needs', fetchNeeds);
router.delete('/need/:id', deleteNeed);
router.get('/need/:id', fetchNeed);
router.put('/need/:id', updateNeed);
router.get('/need/graph/:startNodeURI', getConnectedNeeds);



module.exports = router;