const {JsonWebTokenError, sign} = require("jsonwebtoken");
const {isEmailExists, createTemporaryUserAccount} = require('./user');
const {jwtConfig} = require("../config");
const {sendVerificationMail} = require("../utils");


/**
 * this function create a new temporary user account and send a verification email to him
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const inviteNewUser = async (req, res, next) => {
  const {email, is_superuser, expirationDate} = req.body;
  if (!email) {
    return res.status(400).json({success: false, message: 'Email is required to invite new user.'})
  }

  try {

    const exist = await isEmailExists(email)
    if ( exist === 1){
      // the user already exists
      return res.status(400).json({success: false, message: 'The email is occupied by an account.'})

    } else if (!exist){
      // the user is a new user, store its data inside the database
      const userAccount = await createTemporaryUserAccount({email, is_superuser, expirationDate: new Date(expirationDate)})
      // send email
      const token = sign({
        email
      }, jwtConfig.secret, jwtConfig.options)
      await sendVerificationMail(email, token)
      return res.status(201).json({success: true, message: 'Successfully invited user.'})
    } else {
      // the user is already a temporary user
      const token = sign({
        email
      }, jwtConfig.secret, jwtConfig.options)
      await sendVerificationMail(email, token)
      return res.status(201).json({success: true, message: 'Successfully invited user.'})

    }
  }catch (e) {
    return next(e)
  }
}



module.exports = {inviteNewUser}
