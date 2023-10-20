export function formatName(firstName, lastName, type, _id) {
  if (firstName && lastName) {
    return lastName + ', ' + firstName;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else {
    return ':' + type + '_' + _id;
  }
}
