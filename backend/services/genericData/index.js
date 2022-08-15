const {GDBClientModel, GDBOrganizationModel} = require("../../models");

const option2Model = {
  'client': GDBClientModel,
  'organization': GDBOrganizationModel,
}

async function fetchSingleGeneric(req, res, next) {
  const {option, id} = req.params;

  if (!option2Model[option])
    return res.status(400).json({success: false, message: 'Invalid generic type.'});

  const data = await option2Model[option].findOne({_id: id},
    {populates: ['characteristicOccurrences', 'questionOccurrence']});

  const result = {};

  // Copy the values to occurrence.value regardless of its type.
  if (data.characteristicOccurrences)
    for (const co of data.characteristicOccurrences) {
      result[co.occurrenceOf.replace(':', '')]
        = co.dataStringValue ?? co.dataNumberValue ?? co.dataBooleanValue ?? co.dataDateValue ?? co.objectValues;
    }

  if (data.questionOccurrences)
    for (const qo of data.questionOccurrences) {
      result[qo.occurrenceOf.replace(':', '')] = qo.stringValue;
    }

  return res.status(200).json({data: result, success: true});
}

module.exports = {
  fetchSingleGeneric,
}