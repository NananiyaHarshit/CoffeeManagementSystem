const Razorpay = require('razorpay');
const Stripe = require('stripe');

const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

const getStripeInstance = () => {
  if (process.env.STRIPE_SECRET_KEY) {
    return Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return null;
};

const createPaymentOrder = async ({ amount, currency = 'INR', provider = 'Mock Payment', metadata = {} }) => {
  const amountInSmallestUnit = Math.round(amount * 100);

  if (provider === 'Razorpay') {
    const razorpay = getRazorpayInstance();
    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: amountInSmallestUnit,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: metadata,
      });
      return {
        provider: 'Razorpay',
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      };
    }
  }

  if (provider === 'Stripe') {
    const stripe = getStripeInstance();
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency: currency.toLowerCase(),
        metadata,
      });
      return {
        provider: 'Stripe',
        orderId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        currency,
      };
    }
  }

  // Instant Mock Payment Sandbox for dev environment
  return {
    provider: 'Mock Payment',
    orderId: `mock_pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    amount,
    currency,
    status: 'created',
  };
};

const verifyPaymentSignature = async ({ provider, orderId, paymentId, signature }) => {
  if (provider === 'Razorpay') {
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (razorpayKeySecret && signature) {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
      return expectedSignature === signature;
    }
  }

  // Mock mode always returns true for test sandbox
  return true;
};

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
};
