const {findUserAccountByEmail, updateUserAccount, validateCredentials, updateUserPassword,
    findUserAccountById} = require("./user");
const {sendVerificationMail, sendResetPasswordEmail, sendUpdatePrimaryEmail} = require("../utils");
const {sign} = require("jsonwebtoken");
const {jwtConfig} = require("../config");
const {GDBUserAccountModel} = require("../models");


const getCurrentUserProfile = async (req, res, next) => {
    const user = await findUserAccountByEmail(req.session.email);
    return res.json(user)
};

const getUserProfileById = async (req, res, next) => {
    const id = req.params.id;
    const user = await findUserAccountById(id);
    return res.json(user)
};


const updateProfile = async (req, res, next) => {
    const {id, givenName, familyName, email, altEmail, countryCode, areaCode, phoneNumber} = req.body;
    const updateData = {
        givenName,
        familyName,
        email,
        altEmail,
        countryCode,
        areaCode,
        phoneNumber,
    }

    try {
        await updateUserAccount(req.session.email, updateData)
        return res.status(202).json({success: true, message: 'Successfully update profile.'})

    }catch (e) {
        return next(e)
    }
}


const checkCurrentPassword = async (req, res, next) => {
    const {password} = req.body;
    if (!password) {
        return res.status(400).json({success: false, message: 'Current password is required.'});
    }

    try {
        const {validated, userAccount} = await validateCredentials(req.session.email, password);
        if (!validated) {
            return res.json({success: false, message: 'Password is incorrect.'});
        } else {
            return res.json({
                success: true
            });
        }
    } catch (e) {
        next(e);
    }
};

const saveNewPassword = async (req, res, next) => {
    const {password, email} = req.body;
    if (!password) {
        return res.status(400).json({success: false, message: 'Current password is required.'});
    }

    try {
        const {saved, userAccount} = await updateUserPassword(email || req.session.email, password);

        if (!saved) {
            return res.status(400).json({success: false, message: 'Password is not successfully saved.'});
        } else {
            return res.status(200).json({
                success: true,
                message: 'Password saved'
            });
        }
    } catch (e) {
        next(e);
    }};

const updatePrimaryEmail = async (req, res, next) => {
    const {id, email} = req.body;
    const currentEmail = req.session.email;
    try {
        const token = sign({
            currentEmail, email
        }, jwtConfig.secret, jwtConfig.options)
        await sendUpdatePrimaryEmail(id, email, token)
        return res.status(200).json({sentEmailConfirm: true, message: 'Successfully sent link'})
    }catch (e){
        next(e)
    }
};

const fetchUsers = async (req, res, next) => {
    try{
        const rawData = await GDBUserAccountModel.find({}, {populates: ['primaryContact.telephone',]});
        const data = rawData.map((user) => {
            const ret = {email:user.primaryEmail, id: user._id, isSuperuser: user.role === 'admin',
                primaryContact: user.primaryContact, status: user.status, expirationDate: user.expirationDate}
            return ret
        })




        return res.status(200).json({data, success:true})
    }catch (e){
        next(e)
    }

}

module.exports = {getCurrentUserProfile, updateProfile, checkCurrentPassword, saveNewPassword, updatePrimaryEmail,
fetchUsers, getUserProfileById};

