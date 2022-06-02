const mongoose = require('mongoose');

const GraphDBCounterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0}
});

const GraphDBCounter = mongoose.model('GraphDBCounter', GraphDBCounterSchema);

const getNextCounter = async (counterName) => {
  const counter = await GraphDBCounter.findOneAndUpdate({_id: counterName},
    {$inc: {seq: 1}}, {new: true, upsert: true});
  return counter.seq;
}

module.exports = {GraphDBCounter, getNextCounter};
