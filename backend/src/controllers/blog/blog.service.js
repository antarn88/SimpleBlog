const Blog = require('../../models/blog.model');

exports.create = (blogData) => {
  const blog = new Blog(blogData);
  return blog.save();
};

exports.findAll = () => Blog.find().populate(['owner', 'posts']);

// ADD NEW POST TO POSTLIST
exports.addPost = (blogId, postId) => Blog.findByIdAndUpdate(blogId,
  { $addToSet: { posts: postId } }, { new: true }).populate(['owner', 'posts']);

// DELETE POST FROM POSTLIST
exports.deletePost = (blogId, postId) => Blog.findByIdAndUpdate(blogId, { $pull: { posts: postId } }, { new: true });

exports.delete = (blogId) => Blog.findByIdAndDelete(blogId);
