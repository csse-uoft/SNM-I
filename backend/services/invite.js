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

    if (await isEmailExists(email)){
      // the user already exists
      return res.status(400).json({success: false, message: 'The email is occupied by an account.'})

    } else {
      // the user is a new user, store its data inside the database
      const userAccount = await createTemporaryUserAccount({email, is_superuser, expirationDate: new Date(expirationDate)})
      // send email
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

const register = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const token = await user.save();

    if (process.env.test)
      return res.json({success: true, token: token})

    return res.json({success: true});
  } catch (e) {
    if (e['primary_contact.email']) {
      // Remove the user if email is invalid
      await User.delete(req.body.username)
    }
    return next(e);
  }
};

const validateNewUser = async (req, res, next) => {
  const {token} = req.params
  try {
    const error_message = await User.verify_token(token);
    if (error_message) return res.status(400).json({success: false, message: error_message})
    return res.json({success: true,});
  } catch (e) {
    // This message displays on the frontend.
    if (e instanceof JsonWebTokenError && e.message === 'invalid token' || e instanceof SyntaxError)
      return res.status(400).json({success: false, message: 'Invalid request.'})
    if (e instanceof JsonWebTokenError && e.message === 'jwt expired')
      return res.status(400).json({success: false, message: 'More than 24 hours passed, please register again.'})
    next(e)
  }
};


module.exports = {register, validateNewUser, inviteNewUser}
