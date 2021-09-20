const Post = require('../../models/post.model');

exports.create = (postData) => {
  const post = new Post(postData);
  return post.save();
};

exports.findOne = (id) => Post.findById(id).populate('author');
exports.update = (id, updatedData) => Post.findByIdAndUpdate(id, updatedData, { new: true });
exports.delete = (id) => Post.findByIdAndRemove(id);
