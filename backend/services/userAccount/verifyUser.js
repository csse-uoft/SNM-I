const {verify, JsonWebTokenError} = require("jsonwebtoken");
const {jwtConfig} = require("../../config");
const {findUserAccountByEmail} = require("./user");


const verifyUserForgotPassword = async (req, res, next) => {
  const {token} = req.body

  try{
    const {email} = verify(token, jwtConfig.secret);
    const userAccount = await findUserAccountByEmail(email)
    if (!userAccount){
      return res.status(400).json({success: false, message: "No such user"})
    }
    if (userAccount.status === "temporary"){
      return res.status(400).json({success: false, message: "Verify the email first"})
    }
    return res.status(200).json({success: true, message:'success', email: userAccount.primaryEmail, userId: userAccount._id})
  }catch (e){
    if (e instanceof JsonWebTokenError && e.message === 'invalid token' || e instanceof SyntaxError)
      return res.status(400).json({success: false, message: 'Invalid request.'})
    if (e instanceof JsonWebTokenError && e.message === 'jwt expired')
      return res.status(400).json({success: false, message: 'More than 24 hours passed, please make the admin user invite you again.'})

    return next(e)
  }
}

const verifyChangePrimaryEmail = async (req, res, next) => {
  const {token} = req.body
  try{
    const {currentEmail, email} = verify(token, jwtConfig.secret);
    const userAccount = await findUserAccountByEmail(currentEmail);
    if (!userAccount) {
      return res.status(400).json({success: false, message: "No such user"});
    }
    if (userAccount.status === "temporary"){
      return res.status(400).json({success: false, message: "Verify the email first"})
    }
    userAccount.primaryEmail = email;
    await userAccount.save();
    req.session.email = email;
    return res.status(200).json({success: true, message:'success'})

  }catch (e){
    if (e instanceof JsonWebTokenError && e.message === 'invalid token' || e instanceof SyntaxError)
      return res.status(400).json({success: false, message: 'Invalid request.'})
    if (e instanceof JsonWebTokenError && e.message === 'jwt expired')
      return res.status(400).json({success: false, message: 'More than 24 hours passed, please make the admin user invite you again.'})

    return next(e)
  }
}

module.exports = {verifyUserForgotPassword, verifyChangePrimaryEmail}