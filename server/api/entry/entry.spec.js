'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/entries', function() {

it('should respond with an error', function(done) {
     request(app)
       .get('/api/entries')
       .expect(400)
       .expect('Content-Type', /json/)
       .end(function(err, res) {
         if (err) return done(err);
         done();
       });
   });
 });

it('should respond with a JSON array', function(done) {
     request(app)
       .get('/api/pins?location=37.781157,-122.398720&radius=25')
       .expect(200)
       .expect('Content-Type', /json/)
       .end(function(err, res) {
         console.log(res.body._id);
         if (!res.body._id) return done("couldn't find id")
         if (err) return done(err);
         request(app)
           .get('/api/entries?pin=' + res.body._id)
           .expect(200)
           .expect('Content-Type', /json/)
           .end(function(err, res) {
              if (err) return done(err);
              done();
            });
         done();
       });
   });
