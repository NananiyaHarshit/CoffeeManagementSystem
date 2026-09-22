import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiEye, FiArrowRight } from 'react-icons/fi';
import { getMyOrdersApi } from '../services/order.service';
import { formatPrice } from '../utils/formatPrice';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrdersApi();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Order History</span>
          <h1 className="heading-serif text-3xl font-extrabold text-dark-espresso mt-0.5">
            My Orders ({orders.length})
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-caramel border-t-transparent mb-2"></div>
            <p className="text-xs font-bold text-dark-espresso">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card border border-caramel/15 max-w-md mx-auto">
            <FiPackage className="mx-auto h-12 w-12 text-caramel mb-3" />
            <h3 className="heading-serif text-xl font-bold text-dark-espresso">No Orders Placed Yet</h3>
            <p className="text-xs text-coffee-brown/80 mt-1 mb-6">
              When you place orders, they will appear right here for easy tracking and review.
            </p>
            <Link
              to="/coffee"
              className="inline-flex items-center gap-2 rounded-full bg-caramel px-6 py-2.5 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors"
            >
              Start Shopping
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-dark-espresso">Order #{order._id}</span>
                    <span className="text-xs text-coffee-brown/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="flex items-center gap-2 pt-1">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover bg-cream border border-caramel/10"
                        title={item.name}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs font-bold text-coffee-brown/70">
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Total & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-cream">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-coffee-brown/70 block uppercase font-bold">Total Amount</span>
                    <span className="text-lg font-extrabold text-dark-espresso">{formatPrice(order.total)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-caramel/30 bg-cream px-4 py-2 text-xs font-bold text-dark-espresso hover:bg-caramel/10 transition-colors"
                    >
                      <FiEye className="h-3.5 w-3.5" /> Details
                    </Link>

                    <Link
                      to={`/track-order?id=${order._id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-caramel px-4 py-2 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors"
                    >
                      <FiTruck className="h-3.5 w-3.5" /> Track
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
