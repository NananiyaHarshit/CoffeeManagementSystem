import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import QuantitySelector from '../components/common/QuantitySelector';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, tax, shippingFee, total } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-caramel text-3xl shadow-card">
            <FiShoppingBag />
          </div>
          <h2 className="heading-serif text-2xl font-bold text-dark-espresso">Your Cart Is Empty</h2>
          <p className="text-xs text-coffee-brown/80 mt-2 mb-6">
            Looks like you haven't added any coffees or bakery items to your cart yet.
          </p>
          <Link
            to="/coffee"
            className="inline-flex items-center gap-2 rounded-full bg-caramel px-8 py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors"
          >
            Explore Coffee Shop
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-caramel uppercase tracking-widest">Review Items</span>
            <h1 className="heading-serif text-3xl font-extrabold text-dark-espresso mt-0.5">
              Your Shopping Cart ({cartItems.length})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <FiTrash2 className="h-4 w-4" /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card border border-caramel/15"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover bg-cream border border-caramel/15"
                  />
                  <div>
                    <h3 className="heading-serif text-base font-bold text-dark-espresso">{item.name}</h3>
                    <p className="text-xs text-coffee-brown/70 mt-0.5">{item.size}</p>
                    <span className="text-sm font-bold text-dark-espresso mt-1 block">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-cream">
                  <QuantitySelector
                    quantity={item.quantity}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  />

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-dark-espresso block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/coffee"
              className="inline-flex items-center gap-2 text-xs font-bold text-caramel hover:text-coffee-brown pt-2"
            >
              <FiArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 h-fit space-y-4">
            <h3 className="heading-serif text-xl font-bold text-dark-espresso border-b border-cream pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-coffee-brown">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-dark-espresso">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Est. Tax (5%)</span>
                <span className="font-bold text-dark-espresso">{formatPrice(tax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-dark-espresso">
                  {shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>

              {subtotal < 500 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  Add {formatPrice(500 - subtotal)} more for FREE Delivery!
                </p>
              )}
            </div>

            <div className="border-t border-cream pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-dark-espresso">Total Amount</span>
              <span className="text-2xl font-extrabold text-dark-espresso">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-caramel py-3.5 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors"
            >
              Proceed to Checkout
              <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
