/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Pin = require('../api/pin/pin.model');
var User = require('../api/user/user.model');

Pin.find({}).remove(function() {
  Pin.create({
    name : 'Cheese Daddy',
    description: 'Tasty grilled cheese sandwiches served with tomato soup and a refreshing drink.',
    coordinates: [29.651634, -82.324826],
    hashtags: ['Grilled', 'Cheese', 'Sandwiches', 'Restaurant']
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
