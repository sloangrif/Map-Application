'use strict';

var _ = require('lodash');
var Pin = require('./pin.model');

// Get list of pins
exports.index = function(req, res) {
  console.log(req.query);

  // Defaults
  req.query.limit = req.query.limit || 25;
  req.query.radius = req.query.radius || 0;
  req.query.skip = req.query.skip || 0;
  var date = new Date(0);

  if (req.query.limit > 200 || req.query.limit < 1) { return res.status(400).json("Invalid count. Must be [1-200]"); }

  // Start a query
  var query = Pin.find({}).limit(req.query.limit);
  
  // Query by location
  if (req.query.location) {
    // Error check
    if (req.query.radius > 25000) { return res.status(400).json("Maximum allowed radius is 25000"); }
    if (req.query.location && req.query.radius < 1) { return res.status(400).json("Location radius must be at least 1"); }

    var lat = req.query.location.split(',')[0] || 0;
    var lng = req.query.location.split(',')[1] || 0;
    query.where('coordinates').near({ center: [lat, lng], maxDistance: req.query.radius || 1500 });
  }

  // Query by hashtag
  if (req.query.hashtags) {
    var hashtags = req.query.hashtags.split(',').map(function(str) {
      return str.replace('#','').toLowerCase();
    });
    console.log(hashtags)
    query.where('hashtags').in(hashtags);
  }

  // Show items with timestamp after an ISO-8601 datetime
  //TODO create unit test
  if (req.query.since) {
    date = new Date(req.query.since); 
    if (!isNaN(date)) {
      query.where('created_on').gte(date);
    } else {
      return res.status(400).json("Since datetime could not be parsed"); 
    }
  }
  
  // Show items with timestamp before an ISO-8601 datetime
  //TODO create unit test
  if (req.query.until) {
    date = new Date(req.query.until); 
    if (!isNaN(date)) {
      query.where('created_on').lte(date);
    } else {
      return res.status(400).json("Until datetime could not be parsed"); 
    }
  }

  // Skip some items - useful for paging
  if (req.query.skip > 0) {
    //WARNING this may not scale well
    query.skip(req.query.skip);
  }

  // Show only items with a bounty
  //TODO (optional) check only for active bounties
  //TODO create unit test
  if (!!req.query.bounties_only) {
    query.where('bounties.0').exists();
  }

  // Show only active pins
  query.where('active').equals(true);

  query.exec(function (err, pins) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pins);
  });
};

// Get a single pin
exports.show = function(req, res) {
  Pin.findById(req.params.id, function (err, pin) {
    if(err) { return handleError(res, err); }
    if(!pin) { return res.status(404).send('Not Found'); }
    return res.json(pin);
  });
};

// Creates a new pin in the DB.
exports.create = function(req, res) {
  Pin.create(req.body, function(err, pin) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pin);
  });
};

// Updates an existing pin in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pin.findById(req.params.id, function (err, pin) {
    if (err) { return handleError(res, err); }
    if(!pin) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pin, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pin);
    });
  });
};

// Deletes a pin from the DB.
exports.destroy = function(req, res) {
  Pin.findById(req.params.id, function (err, pin) {
    if(err) { return handleError(res, err); }
    if(!pin) { return res.status(404).send('Not Found'); }
    pin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}