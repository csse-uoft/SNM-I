const {updateUserAccount, updateUserPassword} = require("./user");


const firstEntryUpdate = async (req, res, next) => {

  const {email, newPassword, securityQuestions, userId} = req.body

  try{
    await updateUserPassword(email, newPassword)
    await updateUserAccount(email, {securityQuestions, status: 'permanent'})
    return res.status(200).json({success: true})
  }catch (e){
    next(e)
  }
}


module.exports = {firstEntryUpdate}