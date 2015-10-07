'use strict';

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
  pins: Schema.Types.ObjectId,
  entries: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Bounty', BountySchema);
