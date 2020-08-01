const appAuthController = require('../../controllers/apis/app/auth');
const appAdminController = require('../../controllers/apis/app/admin');
const appCovidController = require('../../controllers/apis/app/covid');
const webAuthController = require('../../controllers/apis/web/auth');
const webAdminController = require('../../controllers/apis/web/admin');

const express = require('express');
let router = express.Router();
router.use('/app/auth', appAuthController);
router.use('/app/admin', appAdminController);
router.use('/app/covid', appCovidController);
router.use('/web/auth', webAuthController);
router.use('/web/admin', webAdminController)

module.exports = router;