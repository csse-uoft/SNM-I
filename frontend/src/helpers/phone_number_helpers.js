export function formatPhoneNumber(phoneNumber) {
  try {
    return "(+" + phoneNumber.countryCode + ") " + phoneNumber.areaCode + "-" + phoneNumber.phoneNumber;
  } catch (e) {
    return phoneNumber;
  }
}
