const createError = require('http-errors');

const User = require('../../models/user.model');

const userService = require('./user.service');
const blogService = require('../blog/blog.service');
const postService = require('../post/post.service');

exports.create = async (req, res, next) => {
  const validationErrors = new User(req.body).validateSync();
  if (validationErrors) {
    return next(new createError.BadRequest(validationErrors));
  }

  try {
    const newUserFromDatabase = await userService.create(req.body);
    await blogService.create({ owner: newUserFromDatabase._id });
    return res.status(201).json(newUserFromDatabase);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    if (req.user && req.user.email) {
      const user = await userService.findOneByEmail(req.user.email);
      if (user.role === 'admin') {
        const userList = await userService.findAll();
        return res.json(userList);
      }
    }
    return next(new createError.Forbidden());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const user = await userService.findOne(req.params.username);
    if (!user) {
      return next(new createError.NotFound('User not found'));
    }

    return res.json(user);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await userService.findOne(req.params.username);
    if (!user) {
      return next(new createError.NotFound('User not found'));
    }

    if (req.user && req.user.email) {
      const loggedUser = await userService.findOneByEmail(req.user.email);
      if (req.user.email === user.email || loggedUser.role === 'admin') {
        const updatedUser = await userService.update(req.params.username, req.body);
        return res.json(updatedUser);
      }
    }

    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const user = await userService.findOne(req.params.username);
    if (!user) {
      return next(new createError.NotFound('User not found'));
    }

    if (req.user && req.user.email) {
      const loggedUser = await userService.findOneByEmail(req.user.email);
      if (req.user.email === user.email || loggedUser.role === 'admin') {
        const blogs = await blogService.findAll();
        const blog = blogs.filter((b) => b.owner.username === req.params.username)[0];

        const deletingPosts$ = [];
        blog.posts.forEach((post) => deletingPosts$.push(postService.delete(post._id)));

        await Promise.all(deletingPosts$);
        await blogService.delete(blog._id);
        await userService.delete(req.params.username);

        return res.json({});
      }
    }
    return next(new createError.Unauthorized());
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
