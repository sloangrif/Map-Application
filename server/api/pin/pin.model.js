'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinSchema = new Schema({
  name: String,
  description: String,
  hashtags: [String],
  active: Boolean,
  geo: {
    gtype: String,
    coordinates: [[Number]]
  },
  created_on: { type: Date, default: Date.now },
  created_by: Schema.Types.ObjectId,
  entries: [Schema.Types.ObjectId],
  bounties: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Pin', PinSchema);
