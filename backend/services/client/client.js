const {findClientById, createClientHelper} = require("./clientHelper");

const createClient = async (req, res, next) => {
  const {questions, characteristics} = req.body;
  const data = {questions, characteristics};
  try {
    await createClientHelper(data);
    return res.status(202).json({success: true, message: 'Successfully create a client.'});
  } catch (e) {
    next(e)
  }
}

module.exports = {createClient}