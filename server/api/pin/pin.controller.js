'use strict';

var _ = require('lodash');
var Pin = require('./pin.model');

// Get list of pins
exports.index = function(req, res) {
  console.log(req.query);

  req.query.count = req.query.count || 25;
  req.query.radius = req.query.count || 0;
  if (req.query.radius > 25000) { return res.status(400).json("Maximum allowed radius is 25000"); }
  if (req.query.location && req.query.radius < 1) { return res.status(400).json("Location radius must be at least 1"); }
  if (req.query.count > 200) { return res.status(400).json("Maximum allowed count is 200"); }

  var query = Pin.find({}).limit(req.query.count);
  
  // Query by location
  if (req.query.location) {
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
    var date = new Date(req.query.since); 
    if (!isNaN(date)) {
      query.where('created_on').gte(date);
    }
  }
  
  // Show items with timestamp before an ISO-8601 datetime
  //TODO create unit test
  if (req.query.until) {
    var date = new Date(req.query.until); 
    if (!isNaN(date)) {
      query.where('created_on').lte(date);
    }
  }

  // Show only items with a bounty
  //TODO (optional) check only for active bounties
  //TODO create unit test
  if (req.query.bounties_only == 1) {
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
