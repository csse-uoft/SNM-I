const {validateCredentials} = require('./user');

const login = async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({success: false, message: 'Email and password are required to login.'});
  }

  try {
    const {validated, userAccount} = await validateCredentials(email, password);
    if (!validated) {
      return res.json({success: false, message: 'Username or password is incorrect.'});
    } else {
      req.session.email = email;
      await userAccount.populate('primaryContact');
      const data = userAccount.toJSON();
      delete data.salt;
      delete data.hash;

      return res.json({
        success: true, data
      });
    }
  } catch (e) {
    next(e);
  }
}

const logout = async (req, res) => {
  req.session.email = '';
  return res.json({success: true})
}

module.exports = {login, logout}
