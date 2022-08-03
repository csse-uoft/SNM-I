const {findClientById, createClientHelper, updateClientHelper} = require("./clientHelper");
const {updateQuestion} = require("../question/question");

const createUpdateClient = async (req, res, next) => {
  const data = req.body;
  if(!Array.isArray(data.questionOccurrences) || !Array.isArray(data.characteristicOccurrences)){
    return res.status(400).json({success: false, message: 'Wrong format on request body'})
  }
  try {
    if(!data.id){
      await createClientHelper(data);
      return res.status(202).json({success: true, message: 'Successfully create a client.'});
    }else if(data.id){
      await updateClientHelper(data)
      return res.status(202).json({success: true, message: 'Successfully update the client'})
    }

  } catch (e) {
    next(e)
  }
}


module.exports = {createUpdateClient, }