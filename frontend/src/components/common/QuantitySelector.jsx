import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({ quantity, onDecrease, onIncrease, min = 1, max = 99 }) => {
  return (
    <div className="inline-flex items-center rounded-full border border-caramel/30 bg-cream p-1 shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full text-dark-espresso transition hover:bg-caramel/20 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <FiMinus className="h-3.5 w-3.5" />
      </button>
      <span className="w-9 text-center text-sm font-bold text-dark-espresso">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full text-dark-espresso transition hover:bg-caramel/20 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <FiPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
