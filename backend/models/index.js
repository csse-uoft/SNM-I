module.exports = {
  ...require('./address'),
  ...require('./UserFunctionalities/phoneNumber'),
  ...require('./UserFunctionalities/person'),
  ...require('./organization'),
  ...require('./UserFunctionalities/userAccount'),
  ...require('./ClientFunctionalities/characteristic'),
  ...require('./ClientFunctionalities/characteristicImplementation')
}
