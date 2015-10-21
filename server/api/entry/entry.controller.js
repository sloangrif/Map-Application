'use strict';

var _ = require('lodash');
var Entry = require('./entry.model');
var User = require('././entry.model');

var getUserScore = function(userId, entry) {
  if (!userId) return 0;

  var score = 0;
  var i = _.findIndex(entry.votes, 'user_id', userId);
  if (i > -1) {
    score = entry.votes[i].score;
  }
  return score;
}

// Get list of entries
exports.index = function(req, res) {
  var date = new Date(0);
  req.user = req.user || {};
  var userId = req.user._id;
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
  
  query.exec(function (err, entries) {
    if(err) { return handleError(res, err); }
    var response = [];
    entries.forEach(function(entry) {
      var tempEntry = entry.toObject();
      tempEntry.score = getUserScore(userId, entry);
      delete tempEntry.votes;
      response.push(tempEntry);
    });
    return res.status(200).json(response);
  });
};

// Get a single entry
exports.show = function(req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if(err) { return handleError(res, err); }
    if(!entry) { return res.status(404).send('Not Found'); }
    // Don't return scores
    var response = entry.toObject();
    var userId = req.user._id;
    delete reponse.votes;
    response.score = getUserScore(userId,entry);
    return res.json(response);
  });
};

// Like an entry
exports.like = function(req, res) {
  if (!req.user || !req.user._id) {
    return req.error("Not logged in");
  }
  var userId = req.user._id;
  Entry.findById(req.params.id, function (err, entry) {
    if(!entry) { return res.status(404).send('Not Found'); }
    if(err) { return handleError(res, err); }
    entry.votes = entry.votes || [];
    var i = _.findIndex(entry.votes, 'user_id', userId);
    if (i > -1) {
      entry.votes[i].score = 1;
    } else {
      entry.votes.push({'user_id': userId, 'score': 1});
    }
    entry.save();

    return res.status(200);
  });
};

exports.dislike = function(req, res) {
  if (!req.user || !req.user._id) {
    return req.error("Not logged in");
  }
  var userId = req.user._id;
  Entry.findById(req.params.id, function (err, entry) {
    if(!entry) { return res.status(404).send('Not Found'); }
    if(err) { return handleError(res, err); }
    entry.votes = entry.votes || [];
    var i = _.findIndex(entry.votes, 'user_id', userId);
    if (i > -1) {
      entry.votes[i].score = -1;
    } else {
      entry.votes.push({'user_id': userId, 'score': -1});
    }
    entry.save();
    console.log(entry);

    return res.status(200);
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
