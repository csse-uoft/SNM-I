const express = require('express');

const partnerOrganizationProvisionService = require("../services/partnerOrganization");
const router = express.Router();

router.get('/partnerOrganizations/', partnerOrganizationProvisionService.getPartnerOrganizations)

module.exports = router;
