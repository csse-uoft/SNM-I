const {findUserAccountByEmail, updateUserAccount, isEmailExists, createTemporaryUserAccount} = require("./user");
const {GDBUserAccountModel} = require("../models/userAccount");
const {jwtConfig} = require("../config");
const {sign} = require("jsonwebtoken");
const {sendVerificationMail} = require("../utils");

const getCurrentUserProfile = async (req, res, next) => {
    const user = findUserAccountByEmail(req.session.email);
    return res.json(user)
}

const updateProfile = async (req, res, next) => {
    const {first_name, last_name, primary_email, secondary_email, telephone, alt_telephone} = req.body;
    if (!req.session.email) {
        return res.status(400).json({success: false, message: 'Primary Email cannot be blank.'})
    }

    try {

        if (await isEmailExists(pEmail)){
            // the user already exists
            return res.status(400).json({success: false, message: 'The email is occupied by an account.'})

        }

        else {
            // store updated data in const updateData
            const userAccount = await updateUserAccount({pEmail, updateData})
            return res.status(202).json({success: true, message: 'Successfully update profile.'})
            // send email
            // const token = sign({
            //     pEmail
            // }, jwtConfig.secret, jwtConfig.options)
            // await sendVerificationMail(pEmail, token)
            // return res.status(201).json({success: true, message: 'Successfully invited user.'})

        }

    }catch (e) {
        return next(e)
    }
}

module.exports = {getCurrentUserProfile, updateProfile};