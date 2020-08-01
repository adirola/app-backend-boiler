const express = require('express');
const authService = require('../../../services/auth/appAuth');
let router = express.Router();

router.post('/get-otp', authService.getOtp);

router.post('/submit-otp', authService.submitOtp);

router.post('/complete-profile' ,authService.isAuthenticated,authService.completeProfile);

module.exports = router;