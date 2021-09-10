/* eslint-disable no-unused-vars */
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');

const logger = require('./config/logger');

const app = express();

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

app.use('/api/posts', require('./controllers/post/post.routes'));

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
