export function formatOperationHours(operationHours) {
	let operationHourRep = "";
	for (let i = 0; i < operationHours.length; i++) {
		operationHourRep = operationHourRep + operationHours[i].week_day + ": " +
                        operationHours[i].start_time + " - " + operationHours[i].end_time + "\n";
	}
	return operationHourRep;
}