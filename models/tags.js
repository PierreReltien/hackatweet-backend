const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tweet' }],
  message: String,
  
});

const Tag = mongoose.model('tags', tagSchema);

module.exports = Tag;
