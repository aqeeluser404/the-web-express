const express = require('express');
const router = express.Router();
const {
    VerifyEmailController,
    ResendVerificationEmailController,
    ForgotPasswordController,
    ResetPasswordController,
    GetInContactController
} = require('../src/controllers/sendEmailController');

router.get('/verify-email', VerifyEmailController);
router.post('/resend-verification-email', ResendVerificationEmailController);
router.post('/forgot-password', ForgotPasswordController);
router.post('/reset-password', ResetPasswordController);
router.post('/contact', GetInContactController);

module.exports = router;