const express = require('express');
const adminService = require('../../../services/admin/webAdmin');
const authService =  require('../../../services/auth/webAuth');
let router = express.Router();

router.get('/dashboard',authService.isAuthenticated ,adminService.getDashBoradInfo);

router.get('/users',authService.isAuthenticated ,adminService.getUsers);

router.get('/user/:id',authService.isAuthenticated ,adminService.getUser);

router.get('/intro',authService.isAuthenticated ,adminService.getFeeds);

router.get('/intro/:postId',authService.isAuthenticated ,adminService.getFeed);

router.get('/announcements',authService.isAuthenticated ,adminService.getAnnouncements);

router.get('/announcement/:announcementId',authService.isAuthenticated ,adminService.getAnnouncement);

router.post('/announcement/:announcementId',authService.isAuthenticated ,adminService.updateAnnouncement);

router.post('/announcement',authService.isAuthenticated, adminService.postAnnouncement);

router.post('/intro/:postId',authService.isAuthenticated, adminService.updateFeed);

router.post('/intro',authService.isAuthenticated, adminService.postFeed);

router.post('/updateUser/:id',authService.isAuthenticated ,adminService.updateUser);

router.delete('/announcement/:announcementId',authService.isAuthenticated ,adminService.deleteAnnouncement)

router.get('/getContactHistory',authService.isAuthenticated ,adminService.getContactHistory)


module.exports = router;