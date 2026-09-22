const ApiError = require('../utils/ApiError');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, 'Access denied: Administrative privilege required');
  }
};

module.exports = { adminOnly };
