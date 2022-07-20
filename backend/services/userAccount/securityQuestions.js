const {findUserAccountByEmail} = require("./user");
const Hashing = require("../../utils/hashing");

const fetchSecurityQuestionsByEmail = async (req, res, next) => {
  const {email} = req.body

  try{
    const userAccount = await findUserAccountByEmail(email)
    await userAccount.populate('securityQuestions')
    if (!userAccount){
      return res.status(400).json({success: false, message: "No such user"})
    }
    if (userAccount.status === "temporary"){
      return res.status(400).json({success: false, message: "You need to verify your email first"})
    }
    const securityQuestions = [userAccount.securityQuestions[0].question, userAccount.securityQuestions[1].question,userAccount.securityQuestions[2].question]
    return res.status(200).json({success: true, message: 'Success', securityQuestions})

  }catch (e){
    next(e)
  }
}

const checkSecurityQuestion = async (req, res, next) => {
  const {email, question, answer} = req.body

  try {
    const userAccount = await findUserAccountByEmail(email)
    await userAccount.populate('securityQuestions')
    for (let i in userAccount.securityQuestions) {
      let securityQuestion = userAccount.securityQuestions[i]
      if(securityQuestion.question === question){
        const match = await Hashing.validatePassword(answer, securityQuestion.hash, securityQuestion.salt)
        if (match) {
          return res.status(200).json({success: true, matched: true, message: 'matched'})
        }else{
          return res.status(200).json({success: false, matched: false, message: 'incorrect'})
        }
      }
    }
    return res.status(400).json({success: false, message: 'No such question'})
  }catch(e){
    next(e)
  }

}



module.exports = {fetchSecurityQuestionsByEmail, checkSecurityQuestion};