const {findUserAccountByEmail, updateUserAccount} = require("./user");


const getCurrentUserProfile = async (req, res, next) => {
    const user = await findUserAccountByEmail(req.session.email);
    console.log('reach backend users.');
    return res.json(user)
}

const updateProfile = async (req, res, next) => {
    const {givenName, familyName, email, altEmail, telephone} = req.body;
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

        else {
            // store updated data in const updateData
            await updateUserAccount(req.session.email, updateData)
            return res.status(202).json({success: true, message: 'Successfully update profile.'})

        }

    }catch (e) {
        return next(e)
    }
}

module.exports = {getCurrentUserProfile, updateProfile};