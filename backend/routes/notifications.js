const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    sendEmail,
    sendSMS,
    getNotifications,
    getNotification
} = require('../controllers/notificationController');

// All routes require authentication
router.use(auth);

// Send email notification
router.post('/email', sendEmail);

// Send SMS notification
router.post('/sms', sendSMS);

// Get all notifications
router.get('/', getNotifications);

// Get single notification
router.get('/:id', getNotification);

module.exports = router;