const { Infobip, AuthType } = require('@infobip-api/sdk');
const { validatePhone, formatPhoneForPakistan } = require('../utils/validators');

// Initialize Infobip client
const infobip = new Infobip({
    baseUrl: process.env.INFOBIP_BASE_URL,
    apiKey: process.env.INFOBIP_API_KEY,
    authType: AuthType.ApiKey,
});

const sendSMS = async ({ to, message }) => {
    try {
        // Format phone number for Pakistan
        const formattedTo = formatPhoneForPakistan(to);

        // Validate phone number
        if (!validatePhone(formattedTo)) {
            throw new Error(`Invalid phone number: ${to}`);
        }

        // Create SMS message
        const smsMessage = {
            messages: [
                {
                    destinations: [{ to: formattedTo }],
                    text: message,
                    from: process.env.INFOBIP_SENDER_ID || 'InfoSMS'
                }
            ]
        };

        // Send SMS
        const response = await infobip.channels.sms.send(smsMessage);

        if (response && response.data && response.data.messages && response.data.messages[0]) {
            const messageInfo = response.data.messages[0];

            if (messageInfo.status && messageInfo.status.groupName === 'PENDING') {
                console.log(`SMS sent successfully to ${formattedTo}, message ID: ${messageInfo.messageId}`);
                return {
                    success: true,
                    message: 'SMS sent successfully',
                    messageId: messageInfo.messageId,
                    status: messageInfo.status.groupName
                };
            } else {
                throw new Error(`SMS failed: ${messageInfo.status && messageInfo.status.description}`);
            }
        } else {
            throw new Error('Invalid response from Infobip API');
        }
    } catch (error) {
        console.error('Infobip SMS error:', error);

        // Extract error message from Infobip response if available
        let errorMessage = 'Failed to send SMS';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.requestError.serviceException.text;
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

// For development/testing without Infobip credentials
const sendMockSMS = async ({ to, message }) => {
    try {
        const formattedTo = formatPhoneForPakistan(to);
        console.log(`Mock SMS sent to ${formattedTo}: ${message}`);

        // Simulate some delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate occasional failures for testing
        if (Math.random() < 0.2) {
            throw new Error('Mock SMS service temporarily unavailable');
        }

        return {
            success: true,
            message: 'SMS sent successfully (mock)',
            messageId: `mock-sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'PENDING'
        };
    } catch (error) {
        console.error('Mock SMS error:', error);
        throw new Error(error.message || 'Failed to send SMS');
    }
};

// Use mock service if Infobip credentials are not configured
const smsService = process.env.INFOBIP_API_KEY ? sendSMS : sendMockSMS;

module.exports = { sendSMS: smsService };