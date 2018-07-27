export function formatEligibilityConditions(condType, condValue) {
  let eligibilityConditions = "";
  eligibilityConditions = eligibilityConditions + condType + ": ";
  for (let i = 0; i < condValue.length; i++) {
    eligibilityConditions = eligibilityConditions + condValue[i] + ", "      
  }
  eligibilityConditions += "\n";
  return eligibilityConditions;
}
