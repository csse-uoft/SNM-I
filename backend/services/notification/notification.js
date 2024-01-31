
const { GDBNotificationModel } = require("../../models/notification");

const formFormatChecking = (form) => {
  return (!form || !form.name || !form.description || !form.datetime || !form.hasOwnProperty('isRead'));
}

const createNotification = async (req, res, next) => {
  const form = req.body;
  if (formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'})
  try {
    const notification = GDBNotificationModel(form);
    await notification.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNotifications = async (req, res, next) => {
  try {
    const notifications = await GDBNotificationModel.find({}, {populates: ['characteristic']});
    return res.status(200).json({success: true, notifications});
  } catch (e) {
    next(e);
  }
};

const fetchNotification = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    const notification = await GDBNotificationModel.findById(id);
    return res.status(200).json({success: true, notification});
  } catch (e) {
    next(e);
  }

};

const updateNotification = async (req, res, next) => {
  const {id} = req.params;
  const form = req.body;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  if (formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'});
  try {
    const notification = await GDBNotificationModel.findById(id);
    notification.name = form.name;
    notification.description = form.description;
    notification.datetime = form.datetime;
    notification.isRead = form.isRead;
    await notification.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
}


module.exports = {createNotification, fetchNotifications, fetchNotification, updateNotification};