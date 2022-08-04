const express = require('express');
const {createClientOrganization, fetchClientOrOrganization,
  fetchClientsOrOrganizations, deleteClientOrOrganization} = require("../services/client");
const router = express.Router();

router.post('/clientOrOrganization/:option/', createClientOrganization);
router.get('/clientOrOrganization/:option/:id', fetchClientOrOrganization);
router.get('/clientOrOrganization/:option', fetchClientsOrOrganizations);
router.delete('/clientOrOrganization/delete/:option/:id', deleteClientOrOrganization);

module.exports = router;