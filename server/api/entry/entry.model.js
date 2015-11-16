'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EntrySchema = new Schema({
  description: {type: String, default: ""},
  active: {type: Boolean, default: true},
  created_by: Schema.Types.ObjectId,
  video: {type: String, required: true},
  thumbnail: {type: String, required: false},
  votes: [{
    user_id: Schema.Types.ObjectId,
    score: {type: Number, default:0, min:-1, max:1}
  }],
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  hashtags: [{type:String, lowercase:true}],
  posted_on: {type:Date, default:Date.now},
  pin: {type: Schema.Types.ObjectId, required: true}
});

//TODO on update votes - increment likes/dislikes
EntrySchema.pre('save', function(next) {
  var countLikes = 0;
  var countDislikes = 0;
  this.votes.forEach(function(vote) {
    if (vote.score === 1) {
      countLikes++;
    }
    else if (vote.score === -1) {
      countDislikes++;
    }
  });
  this.likes = countLikes;
  this.dislikes = countDislikes;
  next();
});
module.exports = mongoose.model('Entry', EntrySchema);
