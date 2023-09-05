export function formatName(firstName, lastName) {
  if (firstName && lastName) {
    return lastName + ', ' + firstName;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else {
    return 'Unknown Name';
  }
}
