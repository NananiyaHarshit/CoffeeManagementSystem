const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coffee',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, default: 'Medium (350ml)' },
  image: { type: String },
});

const trackingStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      'Order Placed',
      'Payment Confirmed',
      'Preparing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'Card', 'COD', 'Mock Payment'],
      default: 'Mock Payment',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: [
        'Order Placed',
        'Payment Confirmed',
        'Preparing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order Placed',
    },
    trackingHistory: [trackingStatusSchema],
    estimatedDelivery: { type: String, default: '30-45 mins' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
