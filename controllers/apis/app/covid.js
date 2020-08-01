const express = require('express');
const covidService = require('../../../services/covid/covid');
const authService = require('../../../services/auth/appAuth');
let router = express.Router();

router.post('/covid-positive-list',authService.isAuthenticated ,covidService.sendCovidPostiveList);

router.post('/upload-interaction-history',authService.isAuthenticated ,covidService.uploadInteractionHistory);

router.get('/announcements', authService.isAuthenticated, covidService.getAnnouncement)

router.get('/intro',authService.isAuthenticated, covidService.getInto )

router.get('/webView/feedback',covidService.getFeedbackPage)

router.post('/updateUser',covidService.updateUserJWT);


module.exports = router;