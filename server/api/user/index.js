'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var recaptcha = require('express-recaptcha');
var multipart = require('connect-multiparty');

var router = express.Router();

recaptcha.init(config.recaptcha.siteKey, config.recaptcha.secretKey);

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', recaptcha.middleware.verify, controller.create);
router.put('/me/profile', multipart(), auth.isAuthenticated(), controller.update);
//router.put('/:id/profile', auth.hasRole('admin'), controller.updateUser);

module.exports = router;
