export function formatLocation(location) {
  if (Object.keys(location).length === 1) {
    return "Not Provided"
  }

  let format_location = ''
  if (location.apt_number !== undefined){
    format_location += `${location.apt_number}-`
  }
  if (location.street_address !== undefined){
    format_location += `${location.street_address}, `
  }
  if (location.city !== undefined)
    format_location += `${location.city}, `
  if (location.province !== undefined)
    format_location += `${location.province}, `
  if (location.postal_code !== undefined)
    format_location += `${location.postal_code}`
  return format_location
}
