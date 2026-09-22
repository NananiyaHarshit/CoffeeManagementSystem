import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiTruck } from 'react-icons/fi';
import OrderTimeline from '../components/order/OrderTimeline';
import { getOrderByIdApi } from '../services/order.service';
import { formatPrice } from '../utils/formatPrice';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await getOrderByIdApi(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Fetch order detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-caramel border-t-transparent mb-2"></div>
          <p className="text-xs font-bold text-dark-espresso">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel hover:underline mb-6">
          <FiArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>

        {/* Header */}
        <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
            <div>
              <span className="text-xs text-coffee-brown/70 font-bold block">ORDER DETAILS</span>
              <h1 className="heading-serif text-2xl font-bold text-dark-espresso">
                Order #{order._id}
              </h1>
              <span className="text-xs text-coffee-brown/70">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <Link
              to={`/track-order?id=${order._id}`}
              className="inline-flex items-center gap-2 rounded-full bg-caramel px-5 py-2.5 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors self-start sm:self-auto"
            >
              <FiTruck className="h-4 w-4" /> Track Status Live
            </Link>
          </div>

          {/* Timeline Status */}
          <OrderTimeline currentStatus={order.orderStatus} trackingHistory={order.trackingHistory} />
        </div>

        {/* Breakdown & Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 rounded-3xl bg-white p-6 shadow-card border border-caramel/15 space-y-4">
            <h3 className="heading-serif text-lg font-bold text-dark-espresso border-b border-cream pb-3">
              Items Ordered ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs pb-3 border-b border-cream/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover bg-cream" />
                    <div>
                      <p className="font-bold text-dark-espresso">{item.name}</p>
                      <span className="text-[10px] text-coffee-brown/70">{item.size} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-dark-espresso">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-cream space-y-1.5 text-xs text-coffee-brown">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-dark-espresso">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-dark-espresso">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-dark-espresso">{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-dark-espresso pt-2 border-t border-cream">
                <span>Total Amount Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 space-y-4 h-fit">
            <h3 className="heading-serif text-lg font-bold text-dark-espresso border-b border-cream pb-3">
              Delivery Address
            </h3>
            <div className="text-xs text-coffee-brown/90 space-y-1">
              <p className="font-bold text-dark-espresso">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="pt-3 border-t border-cream">
              <span className="text-[11px] font-bold text-coffee-brown/70 block uppercase">Payment Information</span>
              <p className="text-xs font-bold text-dark-espresso mt-1">
                Method: {order.paymentMethod}
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 uppercase">
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
