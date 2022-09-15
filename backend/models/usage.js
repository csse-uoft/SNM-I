const mongoose = require('mongoose');

const MDBUsageModel = mongoose.model('Usage', new mongoose.Schema({
  optionKeys: {type: [String], required: true},
  option: {type: String, required: true}, // question, characteristic, ...
  genericType: {type: String, required: true} // client, serviceProvider, appointment, ...
}));

module.exports = {
  MDBUsageModel
}