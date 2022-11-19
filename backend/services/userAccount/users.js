const {findUserAccountByEmail, updateUserAccount, validateCredentials, updateUserPassword,
    findUserAccountById, isEmailExists
} = require("./user");
const {sendVerificationMail, sendResetPasswordEmail, sendUpdatePrimaryEmail, Server400Error} = require("../../utils");
const {sign} = require("jsonwebtoken");
const {jwtConfig} = require("../../config");
const {GDBUserAccountModel} = require("../../models");


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

const updateUserForm = async (req, res, next) => {
    const {id, givenName, familyName, email, altEmail, countryCode, areaCode, phoneNumber} = req.body;

    try {
        const userAccount = await findUserAccountById(id);
        if(givenName) {
            if (!userAccount.primaryContact) {
                userAccount.primaryContact = {};
            }
            userAccount.primaryContact.givenName = givenName;
        }

        if(familyName) {
            userAccount.primaryContact.familyName = familyName;
        }

        if(countryCode) {
            if (!userAccount.primaryContact.telephone) {
                userAccount.primaryContact.telephone={};
            }
            userAccount.primaryContact.telephone.countryCode = countryCode;
        }

        if(areaCode) {
            userAccount.primaryContact.telephone.areaCode = areaCode;
        }

        if(phoneNumber) {
            userAccount.primaryContact.telephone.phoneNumber = phoneNumber;
        }

        if(altEmail) {
            userAccount.secondaryEmail = altEmail;
        }

        await userAccount.save();
        console.log(userAccount)
        return res.status(202).json({success: true, message: 'Successfully update user form.'})

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

/**
 * This function updates primary email.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 * emailStatus === 1 means permanent account
 * emailStatus === 2 means temporary account
 */
const updatePrimaryEmail = async (req, res, next) => {
    const {id, email} = req.body;
    const currentEmail = req.session.email;
    const emailStatus = await isEmailExists(email);
    if (emailStatus === 1) {
        return res.status(200).json({sentEmailConfirm: false,
            message: 'Your input primaryEmail already exists as a permanent account.'});
    }
    if (emailStatus === 2) {
        return res.status(200).json({sentEmailConfirm: false,
            message: 'Your input primaryEmail already exists as a temporary account.'});
    }

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
            return {
                email: user.primaryEmail, id: user._id, isSuperuser: user.role === 'admin',
                primaryContact: user.primaryContact, status: user.status, expirationDate: user.expirationDate
            }
        })
        return res.status(200).json({data, success:true})
    }catch (e){
        next(e)
    }
}

const deleteUser = async (req, res, next) => {
    if (req.params.id === req.session.accountId) {
        return next(new Server400Error("User cannot delete itself."))
    }
    try {
        await GDBUserAccountModel.findAndDelete({_id: req.params.id});
        return res.status(204);
    } catch (e) {
        next(e)
    }
}

module.exports = {getCurrentUserProfile, updateProfile, checkCurrentPassword, saveNewPassword, updatePrimaryEmail,
fetchUsers, getUserProfileById, updateUserForm, deleteUser};

