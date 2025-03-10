const nodemailer = require('nodemailer')


const createMailTransporter = (config) => {
    const { service, host, port, secure, auth } = config;

    const transporter = nodemailer.createTransport({
        ...(service ? { service } : { host, port, secure }),
        auth: {
            user: auth.user,
            pass: auth.pass
        }
    });

    return transporter;
};

// Adjusted to dynamically switch between Gmail and custom hosting
const createMailTransporterWrapper = () => {
    const config = process.env.USE_GMAIL === 'true'
        ? {
            service: 'gmail',
            auth: {
                user: process.env.HOST_EMAIL_ADDRESS,
                pass: process.env.HOST_EMAIL_PASSWORD
            }
        }
        : {
            host: 'mail.the-web.co.za',
            port: 465,
            secure: true,
            auth: {
                user: process.env.HOST_EMAIL_ADDRESS,
                pass: process.env.HOST_EMAIL_PASSWORD
            }
        };

    return createMailTransporter(config);
};

module.exports = createMailTransporterWrapper