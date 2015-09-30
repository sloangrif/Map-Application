'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinSchema = new Schema({
  name: String,
  description: String,
  hashtags: [{type: String, lowercase: true}],
  active: {type: Boolean, default: true},
  coordinates: { type: [Number], index: '2d' },
  created_on: { type: Date, default: Date.now },
  created_by: Schema.Types.ObjectId,
  entries: [Schema.Types.ObjectId],
  bounties: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Pin', PinSchema);
