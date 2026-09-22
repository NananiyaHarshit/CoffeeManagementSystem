const Cart = require('../models/Cart.model');
const Coffee = require('../models/Coffee.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size = 'Medium (350ml)' } = req.body;

  const product = await Coffee.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), size });
  }

  await cart.save();
  cart = await cart.populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Added to cart',
    cart,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.id(itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  if (quantity <= 0) {
    cart.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  cart = await cart.populate('items.product');

  res.status(200).json({
    success: true,
    cart,
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items.pull(itemId);
  await cart.save();
  cart = await cart.populate('items.product');

  res.status(200).json({
    success: true,
    cart,
  });
});

const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    cart: cart || { items: [] },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
