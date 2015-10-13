'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Pin = require('./pin.model');

// Seed
Pin.find({}).remove(function() {
  var id = 0;

  Pin.create({
      name : 'Cheese Daddy',
      description: 'Tasty grilled cheese sandwiches served with tomato soup and a refreshing drink.',
      coordinates: [29.651634, -82.324826],
      hashtags: ['Grilled', 'Cheese', 'Sandwiches', 'Restaurant'],
      thumbnail: '/static/thumbnails/cheese.png'
    }, function(err, pin) {
      id = pin._id;      
    });

  describe('GET /api/pins', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/pins')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('GET /api/pins?hashtags=#cheese,#restaurant', function() {

    it('should respond with JSON array with cheese', function(done) {
      request(app)
        .get('/api/pins?hashtags=%23cheese%2C%23restaurant')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.length.should.be.above(0);
          done();
        });
    });
  });

  describe('GET /api/pins?location=37.781157,-122.398720&radius=25', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/pins?location=37.781157,-122.398720&radius=25')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('GET /api/pins/:id', function() {

    it('should respond with JSON of the \'Cheese Daddy\' Pin', function(done) {
      request(app)
        .get('/api/pins/' + id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          res.body.name.should.be.equal('Cheese Daddy');
          done();
        });
    });
  });
});
