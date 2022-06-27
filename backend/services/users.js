const {findUserAccountByEmail, updateUserAccount, isEmailExists, createTemporaryUserAccount} = require("./user");
const {GDBUserAccountModel} = require("../models/userAccount");
const {jwtConfig} = require("../config");
const {sign} = require("jsonwebtoken");
const {sendVerificationMail} = require("../utils");

const getCurrentUserProfile = async (req, res, next) => {
    const user = findUserAccountByEmail(req.session.email);
    console.log('reach backend users.');
    return res.json(user)
}

const updateProfile = async (req, res, next) => {
    console.log('reach backend update Profile.');
    const {first_name, last_name, primary_email, secondary_email, telephone, alt_telephone} = req.body;
    const updateData = {
        first_name,
        last_name,
        primary_email,
        secondary_email,
        telephone,
        alt_telephone
    }

    try {
        if (!req.session.email) {
            return res.status(400).json({success: false, message: 'Primary Email cannot be blank.'})
        }
        // if (await isEmailExists(req.session.email)){
        //     // the user already exists
        //     return res.status(400).json({success: false, message: 'The email is occupied by an account.'})
        //
        // }

        else {
            // store updated data in const updateData
            const userAccount = await updateUserAccount({primary_email, updateData})
            return res.json(userAccount) &&
                res.status(202).json({success: true, message: 'Successfully update profile.'})

        }

    }catch (e) {
        return next(e)
    }
}

module.exports = {getCurrentUserProfile, updateProfile};