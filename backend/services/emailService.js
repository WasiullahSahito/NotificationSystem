const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = async () => {
    // For development, use a test account
    if (process.env.NODE_ENV === 'development') {
        try {
            const testAccount = await nodemailer.createTestAccount();
            console.log('Ethereal test account created:');
            console.log('Email:', testAccount.user);
            console.log('Password:', testAccount.pass);

            return nodemailer.createTransporter({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        } catch (error) {
            console.error('Error creating test account:', error);
            throw error;
        }
    } else {
        // For production, use real email service
        return nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
};

const sendEmail = async ({ to, subject, body }) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to,
            subject: subject || 'Notification',
            html: body,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: %s', info.messageId);

        // Preview only available when using Ethereal
        if (process.env.NODE_ENV === 'development') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
        };
    } catch (error) {
        console.error('Email error:', error);
        throw new Error(error.message || 'Failed to send email');
    }
};

module.exports = { sendEmail };