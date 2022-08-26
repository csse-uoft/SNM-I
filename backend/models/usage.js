const mongoose = require('mongoose');

const MDBUsage = mongoose.model('Usage', new mongoose.Schema({
  keys: {type: [String], required: true},
  option: {type: String, required: true}, // question, characteristic, ...
  genericType: {type: String, required: true} // client, organization, appointment, ...
}));

module.exports = {
  MDBUsage
}