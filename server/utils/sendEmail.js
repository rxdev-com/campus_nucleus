const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using the default SMTP transport
    // For development, we can use a service like Ethereal or just log to console if no env vars
    // But standard way is SMTP

    // NOTE: For Gmail, you might need "App Password" if 2FA is on.
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'CampusNucleus'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional HTML body
    };

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USERNAME) {
        console.log("-----------------------------------------");
        console.log(`[MOCK EMAIL] To: ${options.email}`);
        console.log(`[MOCK EMAIL] Subject: ${options.subject}`);
        console.log(`[MOCK EMAIL] Message: ${options.message}`);
        console.log("-----------------------------------------");
        return;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
