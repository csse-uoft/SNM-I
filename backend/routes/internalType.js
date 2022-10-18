const express = require('express');
const {fetchInternalTypesByFormType} = require("../services/internalType");
const router = express.Router();

router.get('/internalTypes/:formType', fetchInternalTypesByFormType);

module.exports = router;