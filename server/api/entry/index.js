'use strict';

var express = require('express');
var controller = require('./entry.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();
var multipart = require('connect-multiparty');

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.post('/', multipart(), auth.isAuthenticated(), controller.create);
router.post('/:id/like', auth.isAuthenticated(), controller.like);
router.post('/:id/dislike', auth.isAuthenticated(), controller.dislike);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
