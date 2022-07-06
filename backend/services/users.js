const {findUserAccountByEmail, updateUserAccount, validateCredentials, updateUserPassword} = require("./user");
const {sendVerificationMail} = require("../utils");
const {sign} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const getCurrentUserProfile = async (req, res, next) => {
    const user = await findUserAccountByEmail(req.session.email);
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
    const {password} = req.body;
    if (!password) {
        return res.status(400).json({success: false, message: 'Current password is required.'});
    }

    try {
        const {saved, userAccount} = await updateUserPassword(req.session.email, password);

        if (!saved) {
            return res.json({success: false, message: 'Password is not saved.'});
        } else {
            return res.json({
                success: true
            });
        }
    } catch (e) {
        next(e);
    }

};

module.exports = {getCurrentUserProfile, updateProfile, checkCurrentPassword, saveNewPassword};

