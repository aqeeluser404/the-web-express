const express = require('express');
const router = express.Router();
const {
    VerifyEmailController,
    ResendVerificationEmailController,
    ForgotPasswordController,
    ResetPasswordController,
    GetInContactController,
    SendUserRequestController,
    RentalNotifcationController,
    SendRentalRejectionController,
    SendExtendedDateEmailController
} = require('../src/controllers/sendEmailController');

router.get('/verify-email', VerifyEmailController);
router.post('/resend-verification-email', ResendVerificationEmailController);
router.post('/forgot-password', ForgotPasswordController);
router.post('/reset-password', ResetPasswordController);
router.post('/contact', GetInContactController);
router.post('/user-request/:id', SendUserRequestController);
router.post('/approved-rental', RentalNotifcationController)
router.post('/rejected-rental', SendRentalRejectionController)
router.post('/extended-date/:id', SendExtendedDateEmailController)
module.exports = router;