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

exports.findOne = async (req, res, next) => {
  try {
    const blog = await blogService.find(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }
    if (req.user === undefined || req.user.email !== blog.owner.email) {
      blog.posts = blog.posts.filter((post) => post.visibility === 'public');
    }
    return res.json(blog);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.addPost = async (req, res, next) => {
  try {
    const blog = await blogService.find(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    const post = await postService.findOne(req.params.postId);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }

    if (req.user && req.user.email && post.author.email === blog.owner.email && blog.owner.email === req.user.email) {
      const updatedBlog = await blogService.addPost(req.params.username, req.params.postId);
      return res.json(updatedBlog);
    }

    return next(new createError.Forbidden());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const blog = await blogService.find(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    const post = await postService.findOne(req.params.postId);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }

    if (req.user && req.user.email) {
      const user = await userService.findOneByEmail(req.user.email);
      if ((post.author.email === blog.owner.email && req.user.email)
        || (user.role === 'admin' && post.visibility === 'public')) {
        await blogService.deletePost(req.params.username, req.params.postId);
        await postService.delete(req.params.postId);
        return res.json({});
      }
    }

    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const blog = await blogService.find(req.params.username);
    if (!blog) {
      return next(new createError.NotFound('Blog not found'));
    }

    if (req.user && req.user.email) {
      const user = await userService.findOneByEmail(req.user.email);

      if (!user) {
        return next(new createError.NotFound('Blog not found'));
      }

      if (blog.owner.email === req.user.email || user.role === 'admin') {
        const deletingPosts$ = [];
        blog.posts.forEach((post) => deletingPosts$.push(postService.delete(post._id)));

        await Promise.all(deletingPosts$);
        await blogService.delete(req.params.username);
        await userService.delete(req.params.username);

        return res.json({});
      }
    }

    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
