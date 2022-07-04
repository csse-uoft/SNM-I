const {findUserAccountByEmail, updateUserAccount} = require("./user");
const {sendVerificationMail} = require("../utils");
const {sign} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const getCurrentUserProfile = async (req, res, next) => {
    const user = await findUserAccountByEmail(req.session.email);
    console.log('reach backend users.');
    return res.json(user)
}

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
            await updateUserAccount(id, email, updateData)

            return res.status(202).json({success: true, message: 'Successfully update profile.'})

        }

    }catch (e) {
        return next(e)
    }
}

module.exports = {getCurrentUserProfile, updateProfile};