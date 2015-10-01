'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EntrySchema = new Schema({
  title: String,
  description: String,
  active: {type: Boolean, default: true},
  owner: Schema.Types.ObjectId,
  url: String,
  likes: [{
    user_id: Schema.Types.ObjectId,
    count: {type: Number, default:0, min:-1, max:1}
  }],
  hashtags [{type:String, lowercase:true}],
  posted_on: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Entry', EntrySchema);
