/**
 * @param phone: the phone number
 * @returns {{areaCode: (number|undefined), phoneNumber: number, countryCode: number}}
 */
const parsePhoneNumber = (phone) => {
  const [_, countryCode, phoneNumber, areaCode] = phone.match(/\+(\d+)((?: \((\d+)\))? \d+\-\d+)/)
  return {
    countryCode: Number(countryCode),
    areaCode: areaCode ? Number(areaCode) : undefined,
    phoneNumber: Number(phoneNumber.replace(/[() +-]/g, ''))
  }
}

/**
 * @param countryCode
 * @param phoneNumber
 * @param areaCode
 * @returns {string}
 */
const combinePhoneNumber = ({countryCode, phoneNumber, areaCode}) => {
  let ret = ''
  if (areaCode) {
    ret = '+' + countryCode + ' (' + phoneNumber.toString().slice(0, 3) + ') ' +
      phoneNumber.toString().slice(3, 6) + '-' + phoneNumber.toString().slice(6)
  } else {
    ret = '+' + countryCode + ' ' + phoneNumber.toString().slice(0, 2) + '-' + phoneNumber.toString().slice(2)
  }
  return ret
}

module.exports = {
  parsePhoneNumber,
  combinePhoneNumber
}