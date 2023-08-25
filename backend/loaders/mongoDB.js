const config = require('../config');
const {sleep} = require('../utils')

const mongoose = require('mongoose');
const {createModel} = require('mongoose-gridfs');

mongoose.set('strictQuery', true);
mongoose.connect(config.mongodb.addr, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
let Attachment;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('MongoDB connected.')

  // initialize GridFS
  Attachment = createModel({
    modelName: 'Attachment',
    connection: db
  });
});

/**
 * Get the GridFs Attachment model.
 * @returns {Promise<FileSchema>}
 */
async function getAttachment() {
  while (!Attachment) {
    await sleep(100);
  }
  return Attachment;
}

module.exports = {getAttachment, db};
