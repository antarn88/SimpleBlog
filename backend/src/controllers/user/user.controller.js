const createError = require('http-errors');

const User = require('../../models/user.model');
const userService = require('./user.service');

exports.create = async (req, res, next) => {
  const validationErrors = new User(req.body).validateSync();
  if (validationErrors) {
    return next(new createError.BadRequest(validationErrors));
  }

  try {
    const newUserFromDatabase = await userService.create(req.body);
    return res.status(201).json(newUserFromDatabase);
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const userList = await userService.findAll();
    return res.json(userList);
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

    const updatedUser = await userService.update(req.params.username, req.body);
    return res.json(updatedUser);
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

    await userService.delete(req.params.username);
    return res.json({});
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
