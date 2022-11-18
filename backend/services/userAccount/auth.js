const {validateCredentials, userExpired, findUserAccountById, findUserAccountByEmail} = require('./user');
const Hashing = require("../../utils/hashing");

const login = async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({success: false, message: 'Email and password are required to login.'});
  }

  try {
    if(await userExpired(email)){
      return res.status(400).json({success: false, message: 'User is expired'})
    }
    const {validated, userAccount} = await validateCredentials(email, password);
    if (!validated) {
      return res.status(400).json({success: false, message: 'Username or password is incorrect.'});
    }else if(userAccount.status === 'pending'){
      return res.status(400).json({success: false, message: 'Please confirm the email address first'});
    } else {
      req.session._id = userAccount._id;
      await userAccount.populate('primaryContact.telephone');
      const data = userAccount.toJSON();
      delete data.salt;
      delete data.hash;

      return res.json({
        success: true, data
      });
    }
  } catch (e) {
    next(e);
  }
}

const getUserSecurityQuestions = async (req, res, next) => {
  const id = req.session._id
  if(!id){
    return res.status(400).json({success: false, message:'Please correctly input the email and password first before moving on.'})
  }
  try{
    const userAccount = await findUserAccountById(id)
    await userAccount.populate('securityQuestions')
    if(!userAccount){
      return res.status(400).json({success: false, message:'No such user'})
    }
    const securityQuestions = [userAccount.securityQuestions[0].question, userAccount.securityQuestions[1].question,userAccount.securityQuestions[2].question]
    req.session.email = userAccount.primaryEmail;
    req.session.accountId = userAccount._id;

    return res.status(200).json({success: true, message: 'Success', data:{email: userAccount.primaryEmail, securityQuestions}})
  }catch(e){
    next(e)
  }

}

const checkUserSecurityQuestion = async (req, res, next) => {
  const {email, question, answer} = req.body

  try {
    const userAccount = await findUserAccountByEmail(email)
    await userAccount.populate('securityQuestions')
    for (let i in userAccount.securityQuestions) {
      let securityQuestion = userAccount.securityQuestions[i]
      if(securityQuestion.question === question){
        const match = await Hashing.validatePassword(answer, securityQuestion.hash, securityQuestion.salt)
        if (match) {
          req.session.email = email
          req.session.accountId = userAccount._id;
          delete userAccount.salt;
          delete userAccount.hash;
          delete userAccount.securityQuestions;
          return res.status(200).json({success: true, matched: true, message: 'matched', userAccount})
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

const logout = async (req, res) => {
  req.session.email = '';
  return res.json({success: true})
}

module.exports = {login, logout, getUserSecurityQuestions, checkUserSecurityQuestion}
