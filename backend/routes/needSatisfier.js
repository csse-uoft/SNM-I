const express = require('express');
const {createNeedSatisfier, fetchNeedSatisfiers, deleteNeedSatisfier} = require("../services/needSatisfier/needSatisfier");
const router = express.Router();



router.post('/needSatisfier', createNeedSatisfier);
router.get('/needSatisfiers', fetchNeedSatisfiers);
router.delete('/needSatisfier/:id', deleteNeedSatisfier);
// router.get('/needSatisfier/:id', fetchNeedSatisfier);
// router.put('/needSatisfier/:id', updateNeedSatisfier);



module.exports = router;