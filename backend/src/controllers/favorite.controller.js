const User = require('../models/User.model');
const Coffee = require('../models/Coffee.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.status(200).json({
    success: true,
    favorites: user.favorites,
  });
});

const addFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const coffee = await Coffee.findById(productId);
  if (!coffee) throw new ApiError(404, 'Product not found');

  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(productId)) {
    user.favorites.push(productId);
    await user.save();
  }

  const updatedUser = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    success: true,
    message: 'Added to favorites',
    favorites: updatedUser.favorites,
  });
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter((favId) => favId.toString() !== productId);
  await user.save();

  const updatedUser = await User.findById(req.user.id).populate('favorites');

  res.status(200).json({
    success: true,
    message: 'Removed from favorites',
    favorites: updatedUser.favorites,
  });
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
