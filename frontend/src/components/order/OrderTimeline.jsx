import React from 'react';
import { FaCheckCircle, FaClock, FaBoxOpen, FaShippingFast, FaCheckDouble, FaTimesCircle } from 'react-icons/fa';

const STEPS = [
  'Order Placed',
  'Payment Confirmed',
  'Preparing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

const OrderTimeline = ({ currentStatus = 'Order Placed', trackingHistory = [] }) => {
  const isCancelled = currentStatus === 'Cancelled';
  const currentIndex = isCancelled ? -1 : STEPS.indexOf(currentStatus);

  if (isCancelled) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center border border-red-200 text-red-700">
        <FaTimesCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
        <h4 className="text-lg font-bold">This Order Was Cancelled</h4>
        <p className="text-sm mt-1">If you have any questions, please contact our support team.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 flex-1 relative z-10 w-full md:w-auto">
              {/* Connector line for desktop */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden md:block absolute top-4 left-1/2 w-full h-1 -z-10 transition-colors duration-500 ${
                    idx < currentIndex ? 'bg-caramel' : 'bg-caramel/20'
                  }`}
                />
              )}

              {/* Status Circle */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'border-caramel bg-caramel text-cream shadow-md'
                    : 'border-caramel/30 bg-cream text-coffee-brown/40'
                } ${isCurrent ? 'ring-4 ring-caramel/20 scale-110' : ''}`}
              >
                {isCompleted ? <FaCheckCircle className="h-5 w-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </div>

              {/* Label */}
              <div className="text-left md:text-center">
                <span
                  className={`block text-xs font-bold ${
                    isCurrent ? 'text-dark-espresso scale-105' : isCompleted ? 'text-coffee-brown' : 'text-coffee-brown/50'
                  }`}
                >
                  {step}
                </span>
                {isCurrent && (
                  <span className="inline-block mt-1 text-[10px] bg-caramel/15 text-dark-espresso font-semibold px-2 py-0.5 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
