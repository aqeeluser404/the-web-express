const createMailTransporter = require('./createMailTransporter')

// VERIFY EMAIL
const verifyEmail = (user) => {
    const transporter = createMailTransporter();

    const verificationLink = `${process.env.HOST_LINK_3}/#/verify-email?token=${user.verification.verificationToken}`
    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Verify Email',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Thank you for registering with The Web.</p>
            <p>
                Please click the link below to verify your email address.<br>
                <strong>Your email verification link: </strong><a href="${verificationLink}">Verify Email</a><br>
                If you did not create an account with us, please ignore this email.
            </p>
            <p>
                For enquiries you can email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>
            <p>
                Best regards,<br>
                The Web Team
            </p>
        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message)
        } else {
            console.log('Email sent successfully!')
        }
    })
}

// PASSWORD RESET EMAIL
const sendResetEmail = (user, token) => {
    const transporter = createMailTransporter()

    const resetLink = `${process.env.HOST_LINK_3}/#/reset-password?token=${token}`
    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Reset Password',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>We received a request to reset your password.</p>
            <p>
                Please click the link below to create a new password.<br>
                <strong>Your reset password link: </strong><a href="${resetLink}">Reset Password</a><br>
                If you did not request to reset your password, please ignore this email.
            </p>
            <p>
                For enquiries you can email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>
            <p>
                Best regards,<br>
                The Web Team
            </p>
        `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent successfully!');
        }
    })
}

// CONTACT FORM EMAIL
const getInContactEmail = (user, message) => {
    const transporter = createMailTransporter()

    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: process.env.BUSINESS_EMAIL_ADDRESS,
        subject: `Contact Form Submission from ${user.firstName} ${user.lastName}`,
        html: `
            <p>Dear The Web Team,</p>
            <p>You have received a new message from your contact form.</p>
            <p>
                <strong>Email received from: </strong>${user.firstName} ${user.lastName}<br>
                Message: "${message}"<br>
                Email: ${user.email}
            </p>
            <p>
                Best regards,<br>
                The Web Team
            </p>
        `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent successfully!');
        }
    })
}

// rental Notification method 
// .....

module.exports = { verifyEmail, getInContactEmail, sendResetEmail }