/* eslint-disable no-unused-vars */
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');

const logger = require('./config/logger');

const app = express();

// Authenctication.
const authHandler = require('./auth/authHandler');
const authenticate = require('./auth/authenticate');

mongoose.Promise = global.Promise;

// Connect to MongoDB database
(async () => {
  try {
    const {
      DB_USER,
      DB_PASSWORD,
      DB_HOST,
      DB_NAME,
    } = process.env;

    const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(connectionString);
    logger.info('MongoDB connection has been established successfully.');
  } catch (err) {
    logger.error(err.message);
    process.exit();
  }
})();

// @ts-ignore
app.use(morgan('tiny', { stream: logger.stream }));

app.use(express.json());

// Endpoints
app.post('/api/login', authHandler.login);
app.use('/api/posts', authenticate, require('./controllers/post/post.routes'));
app.use('/api/users', require('./controllers/user/user.routes'));
app.use('/api/blogs', authenticate, require('./controllers/blog/blog.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500);
  } else {
    res.status(err.statusCode);
  }
  logger.error(err.message);
  res.send(err.message);
});

module.exports = app;
