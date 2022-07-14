const {findUserAccountByEmail} = require("./user");
const {verify, JsonWebTokenError} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const verifyUser = async (req, res, next) => {
  const {token} = req.body

  try{
    const {email} = verify(token, jwtConfig.secret);
    const userAccount = await findUserAccountByEmail(email)
    if (!userAccount){
      return res.status(400).json({success: false, message: "No such user"})
    }
    if (userAccount.status !== "pending"){
      return res.status(400).json({success: false, message: "The user is verified already"})
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


module.exports = {verifyUser}