const createError = require('http-errors');

const Post = require('../../models/post.model');
const postService = require('./post.service');

exports.create = async (req, res, next) => {
  const validationErrors = new Post(req.body).validateSync();
  if (validationErrors) {
    return next(new createError.BadRequest(validationErrors));
  }

  try {
    const newPostFromDatabase = await postService.create(req.body);
    return res.status(201).json(newPostFromDatabase);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const postList = await postService.findAll();
    return res.json(postList);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const post = await postService.findOne(req.params.id);
    if (!post) {
      return next(new createError.NotFound('Post not found.'));
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
      return next(new createError.NotFound('Post not found.'));
    }

    const updatedPost = await postService.update(req.params.id, req.body);
    return res.json(updatedPost);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const post = await postService.findOne(req.params.id);
    if (!post) {
      return next(new createError.NotFound('Post not found.'));
    }

    await postService.delete(req.params.id);
    return res.json({});
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
