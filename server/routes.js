/**
 * Main application routes
 */

'use strict';

var express = require('express');
var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/bounties', require('./api/bounty'));
  app.use('/api/pins', require('./api/pin'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/entries', require('./api/entry'));

  app.use('/auth', require('./auth'));
  app.use('/static', express.static(__dirname + "/static"));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets|static)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
