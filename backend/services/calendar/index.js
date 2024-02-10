const {GDBAppointmentModel} = require("../../models/appointment");
const {GDBServiceProviderModel} = require("../../models");

async function fetchAppointment(req, res, next) {
  try {
    const data = await GDBAppointmentModel.find({},
        {
          populates: ['organization.characteristicOccurrences.occurrenceOf',
            'organization.questionOccurrence', 'volunteer.characteristicOccurrences.occurrenceOf',
            'volunteer.questionOccurrence', 'organization.address', 'volunteer.address',]
        });
    return res.status(200).json({success: true, data});
  } catch (e) {
    next(e);
  }
}

module.exports = {fetchAppointment};
