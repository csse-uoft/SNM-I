const {findUserAccountByEmail} = require("./user");
const {verify} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const verifyUser = async (req, res, next) => {
  const {token} = req.body
  // console.log(token)

  try{
    const {email} = verify(token, jwtConfig.secret);
    const userAccount = await findUserAccountByEmail(email)
    // console.log(userAccount)
    if (!userAccount){
      return res.status(400).json({success: false, message: "No such user"})
    }
    if (userAccount.status !== "temporary"){
      return res.status(400).json({success: false, message: "The user is verified already"})
    }
    return res.status(201).json({success: true, message:'success', email: userAccount.primaryEmail})
  }catch (e){
    return next(e)
  }

}


module.exports = {verifyUser}