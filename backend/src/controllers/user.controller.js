const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.status(200).json({
    success: true,
    user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, addresses } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar) user.avatar = avatar;
  if (addresses) user.addresses = addresses;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
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
  getProfile,
  updateProfile,
};
