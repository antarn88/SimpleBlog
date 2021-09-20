const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (authHeader) {
      // Bearer lskdfjlkdsjfldsjflsdfj
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return next(new createError.BadRequest('Incorrect credentials'));
        }

        req.user = user;
        return true;
      });
    }
    return next();
  } catch (err) {
    return next(new createError.InternalServerError(err.message));
  }
};
