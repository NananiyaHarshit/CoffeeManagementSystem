import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaArrowRight } from 'react-icons/fa';
import { formatPrice } from '../utils/formatPrice';

const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="pt-28 pb-16 min-h-screen bg-cream flex items-center justify-center">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-card border border-caramel/15 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200">
            <FaCheckCircle className="h-10 w-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-bold text-caramel uppercase tracking-widest">Payment Confirmed</span>
            <h1 className="heading-serif text-3xl font-extrabold text-dark-espresso mt-1">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-coffee-brown/80 mt-2">
              Your payment was received successfully and our master baristas are now preparing your order.
            </p>
          </div>

          {order && (
            <div className="rounded-2xl bg-cream p-4 text-left border border-caramel/15 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-coffee-brown">Order ID:</span>
                <span className="font-bold text-dark-espresso">#{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coffee-brown">Total Amount Paid:</span>
                <span className="font-bold text-dark-espresso">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coffee-brown">Estimated Delivery:</span>
                <span className="font-bold text-caramel">{order.estimatedDelivery || '30-45 mins'}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={order ? `/track-order?id=${order._id}` : '/track-order'}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-6 py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors"
            >
              <FaTruck className="h-4 w-4" />
              Track Your Order Live
            </Link>

            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-caramel/30 bg-white px-6 py-3 text-xs font-bold text-dark-espresso hover:bg-cream transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
