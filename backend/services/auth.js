const {validateCredentials} = require('./user');

const login = async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({success: false, message: 'Email and password are required to login.'});
  }

  try {
    const result = await validateCredentials(email, password);
    if (!result) {
      return res.json({success: false, message: 'Username or password is incorrect.'});
    } else {
      req.session.email = email;
      return res.json({success: true});
    }
  } catch (e) {
    next(e);
  }
}

const logout = async (req, res) => {
  req.session.username = '';
  return res.json({success: true})
}

module.exports = {login, logout}
