const {createGraphDBModel} = require("graphdb-utils");

const GDBNotificationModel = createGraphDBModel({
  name: {type: String, internalKey: ':hasName'},
  description: {type: String, internalKey: 'cids:hasDescription'},
  datetime: {type: Date, internalKey: ':hasDatetime'},
  isRead: {type: Boolean, internalKey: ':isRead'}
}, {
  rdfTypes: [':Notification'], name: 'notification'
});

module.exports = {
  GDBNotificationModel
}
