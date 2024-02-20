const express = require('express');
const {fetchSingleGeneric, createSingleGeneric, updateSingleGeneric, deleteSingleGeneric, fetchGenericDatas, searchGenericDatas} = require("../services/genericData");
const router = express.Router();
router.get('/generics/:genericType', fetchGenericDatas)
router.get('/generic/:genericType/:id', fetchSingleGeneric);
router.post('/generic/:genericType', createSingleGeneric);
router.put('/generic/:genericType/:id', updateSingleGeneric);
router.delete('/generic/:genericType/:id', deleteSingleGeneric);

router.get('/generics/:genericType/search', searchGenericDatas)


module.exports = router;