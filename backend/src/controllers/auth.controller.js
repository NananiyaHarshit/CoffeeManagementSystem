const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendWelcomeEmail, sendLoginNotification } = require('../services/email.service');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email address');
  }

  const user = await User.create({
    name,
    email,
    phone: phone || '',
    password,
  });

  const token = generateToken(user._id);

  // Send non-blocking welcome email
  sendWelcomeEmail(user.name, user.email).catch((err) => console.error('Welcome email error:', err));

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      favorites: user.favorites,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  // Send login alert
  sendLoginNotification(user.name, user.email).catch((err) => console.error('Login notification error:', err));

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      favorites: user.favorites,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      favorites: user.favorites,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
