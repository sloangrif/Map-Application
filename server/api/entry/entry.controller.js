'use strict';

var _ = require('lodash');
var Entry = require('./entry.model');

// Get list of entrys
exports.index = function(req, res) {
  Entry.find(function (err, entrys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(entrys);
  });
};

// Get a single entry
exports.show = function(req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if(err) { return handleError(res, err); }
    if(!entry) { return res.status(404).send('Not Found'); }
    return res.json(entry);
  });
};

// Creates a new entry in the DB.
exports.create = function(req, res) {
  Entry.create(req.body, function(err, entry) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(entry);
  });
};

// Updates an existing entry in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Entry.findById(req.params.id, function (err, entry) {
    if (err) { return handleError(res, err); }
    if(!entry) { return res.status(404).send('Not Found'); }
    var updated = _.merge(entry, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(entry);
    });
  });
};

// Deletes a entry from the DB.
exports.destroy = function(req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if(err) { return handleError(res, err); }
    if(!entry) { return res.status(404).send('Not Found'); }
    entry.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}