const createError = require('http-errors');

const Post = require('../../models/post.model');

const postService = require('./post.service');
const blogService = require('../blog/blog.service');
const userService = require('../user/user.service');

exports.create = async (req, res, next) => {
  const validationErrors = new Post(req.body).validateSync();
  if (validationErrors) {
    return next(new createError.BadRequest(validationErrors));
  }

  try {
    const user = await userService.findOneById(req.body.author);
    if (!user) {
      return next(new createError.NotFound('Author not found'));
    }

    if (req.user && req.user.email && req.user.email === user.email) {
      const newPostFromDatabase = await postService.create(req.body);
      await blogService.addPost(newPostFromDatabase.author.username, newPostFromDatabase._id);
      return res.status(201).json(newPostFromDatabase);
    }

    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const post = await postService.findOne(req.params.id);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }
    if (req.user === undefined) {
      if (post.visibility === 'private') {
        return next(new createError.Forbidden());
      }
    } else {
      const user = await userService.findOneByEmail(req.user.email);
      if (user.email !== post.author.email && post.visibility === 'private') {
        return next(new createError.Forbidden());
      }
    }
    return res.json(post);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.update = async (req, res, next) => {
  try {
    const post = await postService.findOne(req.params.id);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }

    if (req.user && req.user.email) {
      const user = await userService.findOneByEmail(req.user.email);
      if (!user) {
        return next(new createError.Unauthorized());
      }

      if ((req.user.email === post.author.email) || (user.role === 'admin' && post.visibility === 'public')) {
        const updatedPost = await postService.update(req.params.id, req.body);
        return res.json(updatedPost);
      }
    }
    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const post = await postService.findOne(req.params.id);
    if (!post) {
      return next(new createError.NotFound('Post not found'));
    }

    if (req.user && req.user.email) {
      const user = await userService.findOneByEmail(req.user.email);
      if (!user) {
        return next(new createError.Unauthorized());
      }

      if ((req.user.email === post.author.email) || (user.role === 'admin' && post.visibility === 'public')) {
        await postService.delete(req.params.id);
        await blogService.deletePost(post.author.username, req.params.id);
        return res.json({});
      }
    }
    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
