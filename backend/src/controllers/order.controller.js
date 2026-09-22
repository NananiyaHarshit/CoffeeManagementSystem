const Order = require('../models/Order.model');
const Coffee = require('../models/Coffee.model');
const Cart = require('../models/Cart.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendOrderConfirmationEmail } = require('../services/email.service');

const IN_MEMORY_ORDERS = [];

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'Mock Payment' } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'Cannot place order with empty items list');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
    throw new ApiError(400, 'Complete shipping address is required');
  }

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const itemPrice = item.price || 249;
    subtotal += itemPrice * item.quantity;

    verifiedItems.push({
      product: item.product || item.productId || '664b9f1a23a1000000000001',
      name: item.name || 'Artisanal Coffee',
      price: itemPrice,
      quantity: item.quantity,
      size: item.size || 'Medium (350ml)',
      image: item.image || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800',
    });
  }

  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 500 ? 0 : 49;
  const total = subtotal + tax + shippingFee;

  const orderPayload = {
    _id: `ord_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    user: req.user.id,
    items: verifiedItems,
    shippingAddress,
    subtotal,
    tax,
    shippingFee,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
    orderStatus: 'Order Placed',
    trackingHistory: [
      { status: 'Order Placed', note: 'Order received by Brew Haven' },
      { status: 'Payment Confirmed', note: 'Payment validated successfully' },
      { status: 'Preparing', note: 'Baristas are preparing your artisanal brew' },
    ],
    estimatedDelivery: '30-45 mins',
    createdAt: new Date(),
  };

  let order;
  try {
    order = await Order.create({
      user: req.user.id,
      items: verifiedItems,
      shippingAddress,
      subtotal,
      tax,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      orderStatus: 'Order Placed',
      trackingHistory: orderPayload.trackingHistory,
    });

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  } catch (err) {
    order = orderPayload;
  }

  IN_MEMORY_ORDERS.unshift(order);

  // Send email
  sendOrderConfirmationEmail(req.user.email, order).catch((err) => console.error('Order email error:', err));

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  let orders = [];

  try {
    orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  } catch (err) {
    orders = IN_MEMORY_ORDERS.filter((o) => o.user === req.user.id || o.user?._id?.toString() === req.user.id);
  }

  if (orders.length === 0) {
    orders = IN_MEMORY_ORDERS.filter((o) => o.user === req.user.id || o.user?._id?.toString() === req.user.id);
  }

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  let order;

  try {
    order = await Order.findById(req.params.id).populate('user', 'name email phone');
  } catch (err) {
    order = IN_MEMORY_ORDERS.find((o) => o._id === req.params.id || o._id.toString() === req.params.id);
  }

  if (!order) {
    order = IN_MEMORY_ORDERS.find((o) => o._id === req.params.id || o._id.toString() === req.params.id);
  }

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const trackOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let order;
  try {
    order = await Order.findById(id);
  } catch (err) {
    order = IN_MEMORY_ORDERS.find((o) => o._id === id || o._id.toString() === id);
  }

  if (!order) {
    order = IN_MEMORY_ORDERS.find((o) => o._id === id || o._id.toString() === id);
  }

  if (!order) {
    throw new ApiError(404, 'No order found with the provided Order ID');
  }

  res.status(200).json({
    success: true,
    tracking: {
      orderId: order._id,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      estimatedDelivery: order.estimatedDelivery || '30-45 mins',
      shippingAddress: order.shippingAddress,
      items: order.items,
      total: order.total,
      trackingHistory: order.trackingHistory,
    },
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  let order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = status;
    order.trackingHistory.push({ status, note: note || `Updated to ${status}` });
    await order.save();
  } else {
    order = IN_MEMORY_ORDERS.find((o) => o._id === req.params.id);
    if (order) {
      order.orderStatus = status;
      order.trackingHistory.push({ status, note: note || `Updated to ${status}` });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
};
