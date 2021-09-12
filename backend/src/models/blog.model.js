const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: false,
    },
  ],
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('Blog', BlogSchema);
