const express = require('express');
const adminService = require('../../../services/admin/appAdmin');
let router = express.Router();

router.post('/set-covid-status',adminService.isAdmin ,adminService.setCovidStatus);

router.get('/user',adminService.isAdmin ,adminService.getUsers);

router.get('/user/:mobile',adminService.isAdmin ,adminService.getUser);

router.get('/contacts/:mobile',adminService.isAdmin ,adminService.getContacts);

module.exports = router;