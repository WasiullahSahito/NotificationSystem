const Notification = require('../models/Notification');
const Template = require('../models/Template');
const notificationQueue = require('../queues/notificationQueue');
const { validateEmail, validatePhone, formatPhoneForPakistan, extractTemplateVariables } = require('../utils/validators');

// Send email notification
const sendEmail = async (req, res) => {
    try {
        const { to, subject, body, templateName, variables, schedule } = req.body;

        if (!to) {
            return res.status(400).json({ message: 'Recipient (to) is required' });
        }

        // Validate email addresses
        const recipients = Array.isArray(to) ? to : [to];
        const invalidEmails = recipients.filter(email => !validateEmail(email));

        if (invalidEmails.length > 0) {
            return res.status(400).json({
                message: 'Invalid email addresses',
                invalidEmails
            });
        }

        let messageContent = body || '';
        let emailSubject = subject || '';

        // Use template if provided
        if (templateName) {
            const template = await Template.findOne({ name: templateName, type: 'email' });
            if (!template) {
                return res.status(404).json({ message: 'Email template not found' });
            }

            messageContent = template.content;
            emailSubject = template.subject || emailSubject;

            // Replace template variables
            if (variables && typeof variables === 'object') {
                for (const [key, value] of Object.entries(variables)) {
                    const regex = new RegExp(`{${key}}`, 'g');
                    messageContent = messageContent.replace(regex, value);
                    emailSubject = emailSubject.replace(regex, value);
                }
            }
        }

        // Create notifications for each recipient
        const notifications = [];
        for (const recipient of recipients) {
            const notification = new Notification({
                type: 'email',
                recipient,
                subject: emailSubject,
                message: messageContent,
                createdBy: req.user.id,
                scheduledFor: schedule ? new Date(schedule) : new Date()
            });

            await notification.save();
            notifications.push(notification);

            // Add to queue
            const job = await notificationQueue.add({
                notificationId: notification._id
            }, {
                delay: schedule ? new Date(schedule).getTime() - Date.now() : 0
            });

            console.log(`Email notification job added to queue with ID: ${job.id}`);
        }

        res.status(201).json({
            message: `Email notifications queued for ${recipients.length} recipient(s)`,
            notifications: notifications.map(n => ({
                id: n._id,
                type: n.type,
                recipient: n.recipient,
                status: n.status,
                scheduledFor: n.scheduledFor
            }))
        });
    } catch (error) {
        console.error('Send email error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send SMS notification
const sendSMS = async (req, res) => {
    try {
        const { to, message, templateName, variables, schedule } = req.body;

        if (!to) {
            return res.status(400).json({ message: 'Recipient (to) is required' });
        }

        // Format and validate phone numbers
        const recipients = Array.isArray(to) ? to : [to];
        const formattedRecipients = recipients.map(recipient => {
            return formatPhoneForPakistan(recipient);
        });

        const invalidPhones = formattedRecipients.filter(phone => !validatePhone(phone));

        if (invalidPhones.length > 0) {
            return res.status(400).json({
                message: 'Invalid phone numbers',
                invalidPhones
            });
        }

        let messageContent = message || '';

        // Use template if provided
        if (templateName) {
            const template = await Template.findOne({ name: templateName, type: 'sms' });
            if (!template) {
                return res.status(404).json({ message: 'SMS template not found' });
            }

            messageContent = template.content;

            // Replace template variables
            if (variables && typeof variables === 'object') {
                for (const [key, value] of Object.entries(variables)) {
                    const regex = new RegExp(`{${key}}`, 'g');
                    messageContent = messageContent.replace(regex, value);
                }
            }
        }

        // Create notifications for each recipient
        const notifications = [];
        for (const recipient of formattedRecipients) {
            const notification = new Notification({
                type: 'sms',
                recipient,
                message: messageContent,
                createdBy: req.user.id,
                scheduledFor: schedule ? new Date(schedule) : new Date()
            });

            await notification.save();
            notifications.push(notification);

            // Add to queue
            const job = await notificationQueue.add({
                notificationId: notification._id
            }, {
                delay: schedule ? new Date(schedule).getTime() - Date.now() : 0,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000 // 5 seconds
                }
            });

            console.log(`SMS notification job added to queue with ID: ${job.id}`);
        }

        res.status(201).json({
            message: `SMS notifications queued for ${formattedRecipients.length} recipient(s)`,
            notifications: notifications.map(n => ({
                id: n._id,
                type: n.type,
                recipient: n.recipient,
                status: n.status,
                scheduledFor: n.scheduledFor
            }))
        });
    } catch (error) {
        console.error('Send SMS error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;

        const filter = { createdBy: req.user.id };
        if (type) filter.type = type;
        if (status) filter.status = status;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            select: '-__v'
        };

        // Using simple approach instead of pagination library for simplicity
        const notifications = await Notification.find(filter)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .select(options.select)
            .lean();

        const total = await Notification.countDocuments(filter);

        res.json({
            notifications,
            pagination: {
                page: options.page,
                limit: options.limit,
                total,
                pages: Math.ceil(total / options.limit)
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single notification
const getNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        }).select('-__v');

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        console.error('Get notification error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    sendEmail,
    sendSMS,
    getNotifications,
    getNotification
};