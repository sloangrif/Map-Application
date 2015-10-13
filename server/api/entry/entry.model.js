'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EntrySchema = new Schema({
  title: {type: String, required: true},
  description: String,
  active: {type: Boolean, default: true},
  created_by: Schema.Types.ObjectId,
  url: {type: String, required: true},
  thumbnail: {type: String, required: true},
  likes: [{
    user_id: Schema.Types.ObjectId,
    count: {type: Number, default:0, min:-1, max:1}
  }],
  hashtags: [{type:String, lowercase:true}],
  posted_on: {type:Date, default:Date.now},
  pin: {type: Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('Entry', EntrySchema);
