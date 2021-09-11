const User = require('../../models/user.model');

exports.create = (userData) => {
  const user = new User(userData);
  return user.save();
};

exports.findAll = () => User.find();
exports.findOne = (id) => User.findById(id);
exports.update = (id, updatedData) => User.findByIdAndUpdate(id, updatedData, { new: true });
exports.delete = (id) => User.findByIdAndRemove(id);
