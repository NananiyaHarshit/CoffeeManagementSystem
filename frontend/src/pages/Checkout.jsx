import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLock, FiShield } from 'react-icons/fi';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { createOrderApi } from '../services/order.service';
import { createPaymentApi, verifyPaymentApi } from '../services/payment.service';
import { formatPrice } from '../utils/formatPrice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, subtotal, tax, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Mock Payment');
  const [processing, setProcessing] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    if (!user) {
      toast.info('Please sign in to place an order');
      navigate('/login');
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Initialize Payment Session via Payment Service Layer
      const paymentRes = await createPaymentApi({
        items: cartItems,
        provider: paymentMethod,
      });

      // Step 2: Verify Payment
      const verifyRes = await verifyPaymentApi({
        provider: paymentMethod,
        orderId: paymentRes.payment.orderId,
        paymentId: `pay_sig_${Date.now()}`,
        signature: 'valid_mock_signature',
      });

      if (verifyRes.success) {
        // Step 3: Create Order in Database
        const orderRes = await createOrderApi({
          items: cartItems,
          shippingAddress,
          paymentMethod,
        });

        toast.success('Payment verified & order placed successfully!');
        clearCart();
        navigate('/payment-success', { state: { order: orderRes.order } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Secure Checkout</span>
          <h1 className="heading-serif text-3xl font-extrabold text-dark-espresso mt-1">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Shipping Form & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 space-y-4">
              <h3 className="heading-serif text-lg font-bold text-dark-espresso border-b border-cream pb-3">
                1. Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    required
                    placeholder="Eleanor Vance"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingAddress.email}
                    onChange={handleAddressChange}
                    required
                    placeholder="eleanor@example.com"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    required
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    required
                    placeholder="House / Apt / Street"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                    placeholder="New Delhi"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                    placeholder="Delhi"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-espresso mb-1">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                    placeholder="110001"
                    className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-2.5 text-xs text-dark-espresso focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 space-y-4">
              <h3 className="heading-serif text-lg font-bold text-dark-espresso border-b border-cream pb-3">
                2. Select Payment Gateway
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'Mock Payment', name: 'Instant Test Sandbox', desc: 'Demo Instant Checkout' },
                  { id: 'Razorpay', name: 'Razorpay (India)', desc: 'Cards, UPI, NetBanking' },
                  { id: 'Stripe', name: 'Stripe Card', desc: 'Credit / Debit Card' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex flex-col justify-between cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                      paymentMethod === pm.id
                        ? 'border-caramel bg-caramel/10 font-bold'
                        : 'border-caramel/20 bg-cream hover:border-caramel/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-dark-espresso font-bold">{pm.name}</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-caramel focus:ring-caramel"
                      />
                    </div>
                    <span className="text-[10px] text-coffee-brown/70">{pm.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 h-fit space-y-4">
            <h3 className="heading-serif text-lg font-bold text-dark-espresso border-b border-cream pb-3">
              Order Summary
            </h3>

            {/* Products List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-cream" />
                    <div>
                      <p className="font-bold text-dark-espresso truncate max-w-[140px]">{item.name}</p>
                      <span className="text-[10px] text-coffee-brown/70">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-dark-espresso">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-cream pt-3 space-y-2 text-xs text-coffee-brown">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-dark-espresso">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="font-bold text-dark-espresso">{formatPrice(tax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-dark-espresso">
                  {shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="border-t border-cream pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-dark-espresso">Total Payable</span>
                <span className="text-xl font-extrabold text-dark-espresso">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-caramel py-3.5 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors disabled:opacity-50"
            >
              <FiLock className="h-4 w-4" />
              {processing ? 'Processing Payment...' : `Pay ${formatPrice(total)}`}
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-coffee-brown/70 pt-2">
              <FiShield className="h-3 w-3 text-caramel" />
              256-bit SSL Encrypted Payment Protection
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
