export function formatEligibilityConditions(condType, condValue) {
  if (condValue instanceof Array) {
    return `${condType}: ${condValue.join(', ')}`
  }
  else {
    return `${condType}: ${condValue}`
  }
}
