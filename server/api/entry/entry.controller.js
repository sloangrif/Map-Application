'use strict';

var _ = require('lodash');
var Entry = require('./entry.model');
var User = require('././entry.model');

// Get list of entries
exports.index = function(req, res) {
  var date = new Date(0);

  req.query.limit = req.query.limit || 25;
  req.query.skip = req.query.skip || 0;

  var query = Entry.
                find({}).
                limit(req.query.limit).
                skip(req.query.skip);

  if (req.query.pin) {
    query.where('pin').equals(req.query.pin);
  } else {
    return res.status(400).json("Must include pin id in request parameters");
  }

  if (req.query.creator_id) {
    query.where('created_by').equals(req.query.creator_id);
  }

  if (req.query.since) {
    date = new Date(req.query.since);
    if (!isNaN(date)) {
      query.where('created_on').gte(date);
    } else {
      return res.status(400).json("Since datetime could not be parsed");
    }
  }

  if (req.query.until) {
    date = new Date(req.query.until);
    if (!isNaN(date)) {
      query.where('created_on').lte(date);
    } else {
      return res.status(400).json("Until datetime could not be parsed");
    }
  }

  // Show only active entries
  query.where('active').equals(true);
  
  query.exec(function (err, entrys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(entrys);
  });
};

// Get a single entry
exports.show = function(req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    // Don't return scores
    if (entry.votes) {
      delete entry.votes;
    }
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
