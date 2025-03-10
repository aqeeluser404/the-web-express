const createMailTransporterWrapper = require('./createMailTransporter')

// VERIFY EMAIL
const verifyEmail = (user) => {
    const transporter = createMailTransporterWrapper();

    const verificationLink = `${process.env.HOST_LINK}/#/verify-email?token=${user.verification.verificationToken}`
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
    const transporter = createMailTransporterWrapper()

    const resetLink = `${process.env.HOST_LINK}/#/reset-password?token=${token}`
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
    const transporter = createMailTransporterWrapper()

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

// CONTACT FORM EMAIL
const requestFromTenantEmail = (user, message) => {
    const transporter = createMailTransporterWrapper()

    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: process.env.BUSINESS_EMAIL_ADDRESS,
        subject: `Contact Administration from ${user.firstName} ${user.lastName}`,
        html: `
            <p>Dear The Web Team,</p>
            <p>You have received a new request from one of your tenants.</p>
            <p>
                <strong>Email received from: </strong>${user.firstName} ${user.lastName}<br>
                <strong>Tenant ID: </strong>${user._id}<br>
                ${message}
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
const rentalNotifcationEmail = (user, unit, rental) => {
    const transporter = createMailTransporterWrapper()

    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Rental Application Approved',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>We are pleased to inform you that your rental application has been approved.</p>
            <p>
                Thank you for choosing our services. We look forward to providing you with a great rental experience.<br>
                <strong>Rental Identifier Number: </strong>${rental._id}<br>
                <strong>Unit Number: </strong>${unit.unitNumber}<br>
                <strong>Unit Type: </strong>${unit.unitType}<br>
                <strong>Monthly Rent: </strong>R ${unit.unitPrice}.00
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

const sendRentalRejectionEmail = (user, message) => {
    const transporter = createMailTransporterWrapper();

    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Rental Application Rejected',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>We regret to inform you that your rental application has been rejected due to the following reasons:</p>
            <p>${message}</P>
            <p>Please review the documents and resubmit your application.</p>
            <p>
                For enquiries you can email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>            
            <p>
                Best regards,<br>
                The Web Team
            </p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Rejection email sent successfully!');
        }
    });
};

const sendExtendedDateEmail = (user, message) => {
    const transporter = createMailTransporterWrapper();

    const mailOptions = {
        from: `The Web <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Rental Application Extended',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>We are pleased to inform you that your request for a lease extension has been approved.</p>
            <p>
                <strong>Extension Date: </strong>${message}.
            </p>
            <p>We appreciate your continued residency and look forward to serving you in the future.</p>
            <p>
                For enquiries you can email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>            
            <p>
                Best regards,<br>
                The Web Team
            </p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Rejection email sent successfully!');
        }
    });
}

module.exports = { verifyEmail, getInContactEmail, requestFromTenantEmail, sendResetEmail, rentalNotifcationEmail, sendRentalRejectionEmail, sendExtendedDateEmail }