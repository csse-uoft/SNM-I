const {findUserAccountByEmail, updateUserAccount} = require("./user");
const {sendVerificationMail} = require("../utils");
const {sign} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const getCurrentUserProfile = async (req, res, next) => {
    const user = await findUserAccountByEmail(req.session.email);
    return res.json(user)
};


const updateProfile = async (req, res, next) => {
    const {id, givenName, familyName, email, altEmail, telephone} = req.body;
    const updateData = {
        givenName,
        familyName,
        email,
        altEmail,
        telephone,
    }

    try {
        if (!email) {
            return res.status(400).json({success: false, message: 'Primary Email cannot be blank.'})
        }

        // if (email !== req.session.email) {
        //     const token = sign({
        //         email
        //     }, jwtConfig.secret, jwtConfig.options)
        //
        //     await sendVerificationMail(email, token);
        //     return res.status(202).json({success: true, message: 'Successfully update profile.'})
        // }

        else {
            // store updated data in const updateData
            await updateUserAccount(email, updateData)

            return res.status(202).json({success: true, message: 'Successfully update profile.'})

        }

    }catch (e) {
        return next(e)
    }
}

const fetchSecurityQuestionsByEmail = async (req, res, next) => {
    const {email} = req.body

    try{
        const userAccount = await findUserAccountByEmail(email)
        if (!userAccount){
            return res.status(400).json({success: false, message: "No such user"})
        }
        if (userAccount.status === "temporary"){
            return res.status(400).json({success: false, message: "You need to verify your email first"})
        }
        const securityQuestions = userAccount.securityQuestions
        return res.status(200).json({success: true, message: 'Success', securityQuestions})

    }catch (e){
        next(e)
    }
}

module.exports = {getCurrentUserProfile, updateProfile, fetchSecurityQuestionsByEmail};