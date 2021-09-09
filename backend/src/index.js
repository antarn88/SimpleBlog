/* eslint-disable no-console */
require('dotenv').config();

const logger = require('./config/logger');
const app = require('./server');

const port = process.env.PORT || 3000;

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_NAME) {
  logger.error('No database config found.');
  process.exit();
}

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
