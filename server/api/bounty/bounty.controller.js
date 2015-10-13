'use strict';

var _ = require('lodash');
var Bounty = require('./bounty.model');

// Get list of bountys
exports.index = function(req, res) {
  Bounty.find(function (err, bountys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(bountys);
  });
};

// Get a single bounty
exports.show = function(req, res) {
  Bounty.findById(req.params.id, function (err, bounty) {
    if(err) { return handleError(res, err); }
    if(!bounty) { return res.status(404).send('Not Found'); }
    return res.json(bounty);
  });
};

// Creates a new bounty in the DB.
exports.create = function(req, res) {
  Bounty.create(req.body, function(err, bounty) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(bounty);
  });
};

// Updates an existing bounty in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bounty.findById(req.params.id, function (err, bounty) {
    if (err) { return handleError(res, err); }
    if(!bounty) { return res.status(404).send('Not Found'); }
    var updated = _.merge(bounty, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(bounty);
    });
  });
};

// Deletes a bounty from the DB.
exports.destroy = function(req, res) {
  Bounty.findById(req.params.id, function (err, bounty) {
    if(err) { return handleError(res, err); }
    if(!bounty) { return res.status(404).send('Not Found'); }
    bounty.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}