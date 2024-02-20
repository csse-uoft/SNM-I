const express = require('express');
const { createNotification, fetchNotifications, fetchNotification, updateNotification } = require("../services/notification/notification");

const router = express.Router();

router.post('/notification', createNotification);
router.get('/notifications', fetchNotifications);
router.get('/notification/:id', fetchNotification);
router.put('/notification/:id', updateNotification);

module.exports = router;