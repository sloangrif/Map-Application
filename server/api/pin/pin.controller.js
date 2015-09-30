'use strict';

var _ = require('lodash');
var Pin = require('./pin.model');

// Shamelessly taken from this stack overflow answer
// http://stackoverflow.com/a/11172685/3134975
var measure = function(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

// Get list of pins
exports.index = function(req, res) {
  console.log(req.query);

  if (req.query.radius > 25000) return res.status(400).json("Maximum allowed radius is 25000");
  
  var whereClause = function () {
    var r = req.query.radius || 1609;
    if (req.query.location) {
      var lat1 = req.query.location.split(',')[0]
      var lng1 = req.query.location.split(',')[1]
      if (obj.geo.gtype === 'Point') {
        var coord = obj.geo.coordinates[0];
        console.log(lat1, lng1, coord[0], coord[1])
        return measure(lat1, lng1, coord[0], coord[1]) <= r;
      }
    }
  }

  Pin.find({$where: whereClause}, null, {
    limit: req.query.count || 25
    }, function (err, pins) {
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
