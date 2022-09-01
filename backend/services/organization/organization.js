const {createOrganizationHelper, updateOrganizationHelper} = require("./organizationHelper");


const createOrganization = async (req, res, next) => {
  const data = req.body;

  try {
    await createOrganizationHelper(data);
    return res.status(202).json({success: true, message: 'Successfully create an organization.'});
  } catch (e) {
    next(e)
  }
}

const updateOrganization = async (req, res, next) => {
  const data = req.body;

  try {
    await updateOrganizationHelper(data);
    return res.status(202).json({success: true, message: 'Successfully update the organization.'});
  } catch (e) {
    next(e)
  }
}

module.exports = {createOrganization, updateOrganization}