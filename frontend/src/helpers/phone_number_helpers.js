export function formatPhoneNumber(phoneNumber) {
  try {
    const phoneNumFirstHalf = String(phoneNumber.phoneNumber).slice(0, 3);
    const phoneNumSecondHalf = String(phoneNumber.phoneNumber).slice(3, 8);
    return "+" + phoneNumber.countryCode + " (" + phoneNumber.areaCode + ") " +
      phoneNumFirstHalf + "-" + phoneNumSecondHalf;

    //return "+" + phoneNumber.countryCode + " (" + phoneNumber.areaCode + ") " + phoneNumber.phoneNumber;
  } catch (e) {
    return phoneNumber;
  }
}
