const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['email', 'sms'],
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    scheduledFor: {
        type: Date,
        default: Date.now
    },
    sentAt: {
        type: Date
    },
    retryCount: {
        type: Number,
        default: 0
    },
    error: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better query performance
NotificationSchema.index({ createdBy: 1, createdAt: -1 });
NotificationSchema.index({ status: 1, scheduledFor: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);