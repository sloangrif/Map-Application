'use strict';

var express = require('express');
var controller = require('./entry.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id/like', auth.isAuthenticated(), controller.like);
router.post('/:id/dislike', auth.isAuthenticated(), controller.dislike);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
