'use strict';

var Pin = require('../pin/pin.model');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BountySchema = new Schema({
  name: String,
  description: String,
  hashtags: [{type: String, lowercase: true}],
  active: {type: Boolean, default: true},
  value: Number,
  created_on: {type: Date, default: Date.now},
  expires_on: Date,
  created_by: Schema.Types.ObjectId,
  pin: Schema.Types.ObjectId,
  entries: [Schema.Types.ObjectId]
});

// Quick and dirty implementation of adding bounty to pins
BountySchema.post('save', function (doc) {
  Pin.findById(doc.pin, function (err, pin) {
    if (err) {
      console.log(err);
      return;
    }
    pin.bounty = doc._id;
    pin.save();
  });
});

module.exports = mongoose.model('Bounty', BountySchema);
