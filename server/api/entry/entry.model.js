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
EntrySchema.post('save', function(entry) {
  var countLikes = 0;
  var countDislikes = 0;
  entry.votes.forEach(function(vote) {
    if (vote.score === 1) {
      countLikes++;
    }
    else if (votes.score === -1) {
      countDislikes++;
    }
  });
  entry.likes = countLikes;
  entry.dislikes = countDislikes;
});
module.exports = mongoose.model('Entry', EntrySchema);
