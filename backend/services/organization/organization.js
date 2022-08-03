const {createOrganizationHelper, updateOrganizationHelper} = require("./organizationHelper");

const createUpdateOrganization = async (req, res, next) => {
  const data = req.body;
  if(!Array.isArray(data.questionOccurrences) || !Array.isArray(data.characteristicOccurrences)){
    return res.status(400).json({success: false, message: 'Wrong format on request body'})
  }
  try {
    if(!data.id){
      await createOrganizationHelper(data);
      return res.status(202).json({success: true, message: 'Successfully create an organization.'});
    }else if(data.id){
      await updateOrganizationHelper(data)
      return res.status(202).json({success: true, message: 'Successfully update the organization'})
    }

  } catch (e) {
    next(e)
  }
}


module.exports = {createUpdateOrganization, }