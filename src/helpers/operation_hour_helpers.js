export function formatOperationHour(operationHour) {
  return `${operationHour.week_day}: ${operationHour.start_time} - ${operationHour.end_time}`
}
