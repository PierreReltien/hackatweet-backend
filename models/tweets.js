const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  message: String,
  liked: Number
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;
