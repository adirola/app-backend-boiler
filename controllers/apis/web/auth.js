const express = require('express');
const authService = require('../../../services/auth/webAuth');
let router = express.Router();

router.post('/login', authService.login);

router.post('/register',authService.isAuthenticated,authService.register);



module.exports = router;