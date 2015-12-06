'use strict';

var _ = require('lodash');
var Entry = require('./entry.model');
var User = require('././entry.model');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var uuid = require('node-uuid');
var s3 = require('s3');
var config = require('../../config/environment');

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

var s3BucketName = 'mapnmobi';

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
   // return res.status(400).json("Must include pin id in request parameters");
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
      tempEntry.score = getUserScore(userId, tempEntry);

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

    return res.status(200);
  });
};
// Creates a new entry in the DB.
exports.create = function(req, res) {
  if (!req.body || !req.body.pin || !req.files.file) {
    console.log(req.body);
    return res.status(400).json("Must include pin and video in data");
  }

  var file = req.files.file;
  var id = uuid.v4();
  var basePath = path.resolve('./server/static');

  var videoFile = '/tmp/' + id + '.mp4';
  var screenshotFile = '/tmp/' + id + '.png';
  var wmimage = basePath + '/mapn/logo.png';

  req.body.video = "/static/mapn/uploading.png";
  req.body.thumbnail = "/static/mapn/uploading.png";
  req.body.created_by = req.user._id;

  // TODO make sure the pin exists..
  Entry.create(req.body, function(err, entry) {
    if(err) { return handleError(res, err); }
    //Convert video and take a screenshot
    var proc = new ffmpeg(file.path)
    .screenshots({
      count: 1,
      filename: id + '.png',
      folder: '/tmp',
      size: '250x250'
    })
    .size('640x?')
    .aspect('4:3')
    .audioCodec('aac')
    .audioQuality(0)
    .videoCodec('libx264')
    .videoBitrate(1000)
    .addOption('-vf', 'movie='+wmimage+ ' [watermark]; [in] [watermark] overlay=0:0 [out]')
    .output(videoFile)
    .on('error', function(err, stdout, stderr) {
      if (err) {
        console.log('An error occurred with ffmpeg: ' + err.message, stdout, stderr);  
        return handleError(res, err);
      }
    })
    .on('end', function() {
      console.log('Finished processing video: ' + id);
      var video_params = {
        localFile: videoFile,
        s3Params: {
          Bucket: s3BucketName,
          Key: id + '.mp4',
          ACL: 'public-read'
          // other options supported by putObject, except Body and ContentLength.
          // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        },
      };
      var screenshot_params = {
        localFile: screenshotFile,
        s3Params: {
          Bucket: s3BucketName,
          Key: id + '.png',
          ACL: 'public-read'
        },
      };
      var uploader = client.uploadFile(video_params);
      uploader.on('error', function(err) {
        console.log("unable to upload:", err.stack);
        entry.delete();
      });
      uploader.on('end', function() {
        fs.unlink(file.path);   // delete temp files
        fs.unlink(videoFile);
        entry.video = s3.getPublicUrlHttp(s3BucketName, id + '.mp4');
        entry.save();
      });

      uploader = client.uploadFile(screenshot_params);
      uploader.on('error', function(err) {
        console.log("unable to upload:", err.stack);
        entry.delete();
      });
      uploader.on('end', function() {
        fs.unlink(screenshotFile);
        entry.thumbnail = s3.getPublicUrlHttp(s3BucketName, id + '.png');
        entry.save();
      });

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
    // Check if user is admin or owns this entry
    if (!(req.user.role.toString() === 'admin' || req.user._id.toString() === entry.created_by.toString())) {
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
