'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinSchema = new Schema({
  name: {type: String, required: true},
  description: String,
  thumbnail: {type: String, required: false},
  hashtags: [{type: String, lowercase: true}],
  active: {type: Boolean, default: true},
  coordinates: { type: [Number], index: '2d', required: true },
  created_on: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, required: false}, //TODO require true
  entries: [Schema.Types.ObjectId],
  bounties: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Pin', PinSchema);
