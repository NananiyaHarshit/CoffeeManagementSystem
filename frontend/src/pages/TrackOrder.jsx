import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiTruck, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import OrderTimeline from '../components/order/OrderTimeline';
import { trackOrderApi } from '../services/order.service';
import { formatPrice } from '../utils/formatPrice';
import { toast } from 'react-toastify';

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTracking = async (idToSearch) => {
    if (!idToSearch) return;
    try {
      setLoading(true);
      const res = await trackOrderApi(idToSearch);
      setTrackingData(res.tracking);
    } catch (err) {
      toast.error('Could not find order with provided ID');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialId = searchParams.get('id');
    if (initialId) {
      setOrderId(initialId);
      fetchTracking(initialId);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      setSearchParams({ id: orderId.trim() });
      fetchTracking(orderId.trim());
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Real-Time Status</span>
          <h1 className="heading-serif text-3xl font-extrabold text-dark-espresso mt-1">
            Track Your Coffee Order
          </h1>
          <p className="text-xs text-coffee-brown/80 mt-2">
            Enter your Order ID below to view live barista preparation, packing, and courier delivery updates.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 mb-10 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-caramel h-4 w-4" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. 664b9f1a23...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full rounded-full border border-caramel/30 bg-cream/50 pl-10 pr-4 py-3 text-xs text-dark-espresso focus:outline-none focus:border-caramel"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-caramel px-6 py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Tracking Details View */}
        {trackingData && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-caramel/15 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream pb-4">
                <div>
                  <span className="text-[10px] font-bold text-coffee-brown uppercase tracking-wider">ORDER IDENTIFIER</span>
                  <h2 className="heading-serif text-xl font-bold text-dark-espresso">
                    #{trackingData.orderId}
                  </h2>
                  <span className="text-xs text-coffee-brown/70">
                    Placed: {new Date(trackingData.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-2 border border-caramel/20">
                  <FiClock className="h-4 w-4 text-caramel" />
                  <div>
                    <span className="text-[10px] text-coffee-brown/70 block uppercase font-bold">Est. Delivery</span>
                    <span className="text-xs font-extrabold text-dark-espresso">{trackingData.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Component */}
              <OrderTimeline currentStatus={trackingData.orderStatus} trackingHistory={trackingData.trackingHistory} />

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cream">
                {/* Delivery Address */}
                <div className="rounded-2xl bg-cream p-4 border border-caramel/15">
                  <h4 className="heading-serif text-sm font-bold text-dark-espresso mb-2 flex items-center gap-1.5">
                    <FiMapPin className="h-4 w-4 text-caramel" /> Shipping Destination
                  </h4>
                  <p className="text-xs font-bold text-dark-espresso">{trackingData.shippingAddress.fullName}</p>
                  <p className="text-xs text-coffee-brown/80 mt-1">{trackingData.shippingAddress.address}</p>
                  <p className="text-xs text-coffee-brown/80">
                    {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} - {trackingData.shippingAddress.postalCode}
                  </p>
                </div>

                {/* Items Summary */}
                <div className="rounded-2xl bg-cream p-4 border border-caramel/15">
                  <h4 className="heading-serif text-sm font-bold text-dark-espresso mb-2 flex items-center gap-1.5">
                    <FiPackage className="h-4 w-4 text-caramel" /> Items ({trackingData.items.length})
                  </h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {trackingData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-dark-espresso">{item.name} x {item.quantity}</span>
                        <span className="font-bold text-dark-espresso">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
