const Review = require('../models/Review.model');
const Coffee = require('../models/Coffee.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    throw new ApiError(400, 'Product ID, rating (1-5), and comment are required');
  }

  const coffee = await Coffee.findById(productId);
  if (!coffee) throw new ApiError(404, 'Product not found');

  const existingReview = await Review.findOne({ user: req.user.id, product: productId });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this coffee product');
  }

  const review = await Review.create({
    user: req.user.id,
    product: productId,
    rating: Number(rating),
    comment,
  });

  // Recalculate coffee average rating
  const allReviews = await Review.find({ product: productId });
  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  coffee.rating = Number(avgRating.toFixed(1));
  coffee.reviewCount = allReviews.length;
  await coffee.save();

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review,
    newRating: coffee.rating,
  });
});

module.exports = {
  getProductReviews,
  createReview,
};
