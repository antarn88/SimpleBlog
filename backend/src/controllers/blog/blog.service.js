const Blog = require('../../models/blog.model');

exports.create = (blogData) => {
  const blog = new Blog(blogData);
  return blog.save();
};

exports.find = (username) => Blog.findOne({ username }).populate(['owner', 'posts']);

// ADD NEW POST TO POSTLIST
exports.addPost = (username, postId) => Blog.findOneAndUpdate(
  { username }, { $addToSet: { posts: postId } }, { new: true },
).populate(['owner', 'posts']);

// DELETE POST FROM POSTLIST
exports.deletePost = (username, postId) => Blog.findOneAndUpdate({ username }, { $pull: { posts: postId } }, { new: true });

exports.delete = (username) => Blog.findOneAndDelete({ username });
