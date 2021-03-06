const User = require('../../models/user.model');

exports.create = (userData) => {
  const user = new User(userData);
  return user.save();
};

exports.findAll = () => User.find();
exports.findOne = (username) => User.findOne({ username });
exports.findOneById = (id) => User.findById(id);
exports.findOneByEmail = (email) => User.findOne({ email });
exports.update = (username, updatedData) => User.findOneAndUpdate({ username }, updatedData, { new: true });
exports.delete = (username) => User.findOneAndDelete({ username });
