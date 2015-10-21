/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Pin = require('../api/pin/pin.model');
var User = require('../api/user/user.model');
var Entry = require('../api/entry/entry.model');
var fs = require('fs');
var path = require('path');

var staticPath = path.resolve('./server/static');
console.log(staticPath);

// Delete uploaded files (images/videos)
require("glob").glob(staticPath + "/*.*", function (er, files) {
  files.forEach(function(file) {
    fs.unlinkSync(file)
  });
 });

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    phone: '2345678901',
    email: 'test@test.com',
    password: 'test'
  });
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    phone: '2345678902',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
  });
});

Entry.find({}).remove();
Pin.find({}).remove(function() {
  Pin.create({
    name : 'Cheese Daddy',
    description: 'Tasty grilled cheese sandwiches served with tomato soup and a refreshing drink.',
    coordinates: [29.651634, -82.324826],
    hashtags: ['Grilled', 'Cheese', 'Sandwiches', 'Restaurant'],
    thumbnail: '/static/test/cheese_id.png'
  }, function(err, pin) {
    if(err) {
      console.warn(err);
      return;
    }
    var id = pin._id;
    Entry.create({
      pin: id,
      title: 'Hello world',
      description: 'Some description',
      url: '/static/test/2be7787f-ce48-40a9-a53e-1a53ffc421e2.mp4',
      thumbnail: '/static/test/2be7787f-ce48-40a9-a53e-1a53ffc421e2.png'
    });
  });
});
