const express = require('express');
const {
  createNeedSatisfier, fetchNeedSatisfiers, deleteNeedSatisfier, fetchNeedSatisfier,
  updateNeedSatisfier, getConnectedNeedSatisfiers
} = require("../services/needSatisfier/needSatisfier");
const router = express.Router();


router.post('/needSatisfier', createNeedSatisfier);
router.get('/needSatisfiers', fetchNeedSatisfiers);
router.delete('/needSatisfier/:id', deleteNeedSatisfier);
router.get('/needSatisfier/:id', fetchNeedSatisfier);
router.put('/needSatisfier/:id', updateNeedSatisfier);
router.get('/needSatisfier/graph/:startNodeURI', getConnectedNeedSatisfiers);


module.exports = router;