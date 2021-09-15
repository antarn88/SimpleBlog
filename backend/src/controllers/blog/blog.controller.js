const createError = require('http-errors');

const Blog = require('../../models/blog.model');

const blogService = require('./blog.service');
const postService = require('../post/post.service');
const userService = require('../user/user.service');

exports.create = async (req, res, next) => {
  const validationErrors = new Blog(req.body).validateSync();
  if (validationErrors) {
    return next(new createError.BadRequest(validationErrors));
  }

  try {
    const newBlogFromDatabase = await blogService.create(req.body);
    return res.status(201).json(newBlogFromDatabase);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const blogs = await blogService.findAll();
    return res.json(blogs);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const blog = await blogService.findOne(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    return res.json(blog);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.addPost = async (req, res, next) => {
  try {
    const blog = await blogService.findOne(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    const post = await postService.findOne(req.params.postId);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }

    const updatedBlog = await blogService.addPost(req.params.username, req.params.postId);

    return res.json(updatedBlog);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const blog = await blogService.findOne(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    const post = await postService.findOne(req.params.postId);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }

    await blogService.deletePost(req.params.username, req.params.postId);
    await postService.delete(req.params.postId);

    return res.json({});
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const blog = await blogService.findOne(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    const deletingPosts$ = [];
    blog.posts.forEach((post) => deletingPosts$.push(postService.delete(post._id)));

    await Promise.all(deletingPosts$);
    await blogService.delete(req.params.username);
    await userService.delete(req.params.username);

    return res.json({});
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
