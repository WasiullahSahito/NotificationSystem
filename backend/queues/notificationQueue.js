const Queue = require('bull');
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');

// Create a new queue
const notificationQueue = new Queue('notification queue', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    }
});

// Process jobs from the queue
notificationQueue.process(async (job) => {
    const { notificationId } = job.data;

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            throw new Error('Notification not found');
        }

        let result;
        if (notification.type === 'email') {
            result = await sendEmail({
                to: notification.recipient,
                subject: notification.subject,
                body: notification.message
            });
        } else if (notification.type === 'sms') {
            result = await sendSMS({
                to: notification.recipient,
                message: notification.message
            });
        }

        // Update notification status
        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();

        return result;
    } catch (error) {
        console.error(`Notification ${notificationId} failed:`, error.message);

        // Update notification status to failed
        await Notification.findByIdAndUpdate(notificationId, {
            status: 'failed',
            error: error.message,
            $inc: { retryCount: 1 }
        });

        // Retry logic (retry up to 3 times)
        if (job.attemptsMade < 3) {
            // Exponential backoff for retries
            const delay = Math.pow(2, job.attemptsMade) * 5000; // 5s, 10s, 20s
            throw new Error(`Will retry in ${delay}ms: ${error.message}`);
        }

        return { error: error.message };
    }
});

// Handle completed jobs
notificationQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result);
});

// Handle failed jobs
notificationQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed with error:`, error.message);
});

module.exports = notificationQueue;