'use strict';

var _ = require('lodash');
var Entry = require('./entry.model');
var User = require('././entry.model');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var uuid = require('node-uuid')

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
  Entry.findById(req.params.id).lean().exec(function (err, entry) {
    if(err) { return handleError(res, err); }
    if(!entry) { return res.status(404).send('Not Found'); }
    if (entry.votes) { delete entry.votes; } // dont return vote array
    if (!req.user) { return res.json(entry); } // user not logged in
    var userId = req.user._id;
    if (userId) { entry.score = getUserScore(userId,entry); }
    return res.json(entry);
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
  if (!req.body || !req.body.pin || !req.files.file) {
    return res.status(400).json("Must include pin and video in data");
  }

  var file = req.files.file;
  var id = uuid.v4();
  var basePath = path.resolve('./server/static');

  var videoFile = id + '.mp4';
  var screenshotFile = id + '.png';
  var wmimage = basePath + '/mapn/logo.png';

  req.body.video = "/static/" + videoFile;
  req.body.thumbnail = "/static/mapn/uploading.png";
  req.body.created_by = req.user._id;

  // TODO make sure the pin exists..
  Entry.create(req.body, function(err, entry) {
    if(err) { return handleError(res, err); }
    //Convert video and take a screenshot
    var proc = new ffmpeg(file.path)
    .takeScreenshots({
        filename: screenshotFile,
        count: 1,
        size: '250x250'
      }, basePath, function(err) {
        if(err) {
          console.log('An error occurred with ffmpeg: ' + err.message);
        }
    })
    .output(basePath + '/' + videoFile)
    .size('640x?')
    .aspect('4:3')
    .audioCodec('libmp3lame')
    .audioQuality(0)
    .videoCodec('libx264')
    .videoBitrate(1000)
    .addOption('-vf', 'movie='+wmimage+ ' [watermark]; [in] [watermark] overlay=0:0 [out]')
    .on('error', function(err, stdout, stderr) {
      if (err) {
        console.log('An error occurred with ffmpeg: ' + err.message, stdout, stderr);
      }
    })
    .on('end', function() {
      entry.thumbnail = "/static/" + screenshotFile;
      entry.save();
      fs.unlink(file.path);   // delete temp file
      console.log('Finished processing video: ' + videoFile);
    });
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
    if (req.user._id !== entry.created_by || req.user.role !== 'admin') {
      return res.status(403).send('You must own this entry or be admin');
    }
    entry.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
