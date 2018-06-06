export function formatLocation(location) {
  if (location.apt_number && location.apt_number.length > 0) {
    return `${location.apt_number}-${location.street_address},
      ${location.city}, ${location.province} ${location.postal_code}`
  } else {
    return `${location.street_address}, ${location.city}, ${location.province}
      ${location.postal_code}`
  }
}
