const { createPaymentOrder, verifyPaymentSignature } = require('../services/payment.service');
const Coffee = require('../models/Coffee.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createPayment = asyncHandler(async (req, res) => {
  const { items, provider = 'Mock Payment' } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'Items required to calculate payment total');
  }

  let subtotal = 0;
  for (const item of items) {
    const product = await Coffee.findById(item.product);
    if (!product) throw new ApiError(404, 'Product not found during payment init');
    subtotal += product.price * item.quantity;
  }

  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 500 ? 0 : 49;
  const totalAmount = subtotal + tax + shippingFee;

  const paymentData = await createPaymentOrder({
    amount: totalAmount,
    currency: 'INR',
    provider,
    metadata: { userId: req.user.id },
  });

  res.status(200).json({
    success: true,
    payment: paymentData,
    amountDetails: {
      subtotal,
      tax,
      shippingFee,
      total: totalAmount,
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { provider, orderId, paymentId, signature } = req.body;

  const isValid = await verifyPaymentSignature({ provider, orderId, paymentId, signature });

  if (!isValid) {
    throw new ApiError(400, 'Payment verification failed: Invalid signature');
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    paymentId: paymentId || `pay_${Date.now()}`,
    status: 'paid',
  });
});

module.exports = {
  createPayment,
  verifyPayment,
};
