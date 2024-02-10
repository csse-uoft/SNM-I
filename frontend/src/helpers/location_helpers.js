export function formatLocation(location, addressInfo) {
  if (Object.keys(location).length === 1) {
    return "Not Provided"
  }

  let format_location = ''
  if (location.unitNumber) {
    format_location += `${location.unitNumber}-`
  }
  if (location.streetNumber) {
    format_location += `${location.streetNumber} `
  }
  if (location.streetName) {
    format_location += `${location.streetName}`
  }
  if (location.streetType && addressInfo?.streetTypes) {
    format_location += ` ${addressInfo.streetTypes[location.streetType]}`
  }
  if (location.streetDirection && addressInfo?.streetDirections) {
    format_location += ` ${addressInfo.streetDirections[location.streetDirection]}`
  }
  if (location.city) {
    format_location += `, ${location.city}`
  }
  if (location.state && addressInfo?.states) {
    format_location += `, ${addressInfo.states[location.state]}`
  }
  if (location.postalCode) {
    format_location += ` ${location.postalCode}`
  }

  if (format_location === '') {
    if (location.lat && location.lng) {
      format_location += `(${location.lat}, ${location.lng})`
    }
  }
  return format_location
}
