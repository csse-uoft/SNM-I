const {sendResetPasswordEmail} = require("../utils");
const {sign} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const sendVerificationEmail = async (req, res, next) => {
  const {email} = req.body
  try {
    const token = sign({
      email
    }, jwtConfig.secret, jwtConfig.options)
    await sendResetPasswordEmail(email, token)
    return res.status(200).json({success: true, message: 'Successfully sent link'})
  }catch (e){
    next(e)
  }

}

module.exports = {sendVerificationEmail}