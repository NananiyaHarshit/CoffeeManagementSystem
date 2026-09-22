const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, access token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'brew_haven_super_secret_jwt_key_2026_spec');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'User account no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Token verification failed or expired');
  }
});

module.exports = { protect };
