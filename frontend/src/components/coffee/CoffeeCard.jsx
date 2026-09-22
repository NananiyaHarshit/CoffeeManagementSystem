import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingBag } from 'react-icons/fa';
import RatingStars from '../common/RatingStars';
import useCart from '../../hooks/useCart';
import useFavorites from '../../hooks/useFavorites';
import { formatPrice } from '../../utils/formatPrice';

const CoffeeCard = ({ coffee }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const fav = isFavorite(coffee._id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(coffee);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(coffee);
  };

  return (
    <div
      onClick={() => navigate(`/coffee/${coffee._id}`)}
      className="group relative cursor-pointer flex flex-col justify-between rounded-2xl bg-white p-4 shadow-card border border-caramel/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-cream">
          <img
            src={coffee.images[0]}
            alt={coffee.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95 text-caramel"
            aria-label="Save to favorites"
          >
            {fav ? <FaHeart className="h-4 w-4 text-red-500" /> : <FaRegHeart className="h-4 w-4" />}
          </button>
          {/* Category Badge */}
          <span className="absolute bottom-3 left-3 rounded-full bg-dark-espresso/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cream backdrop-blur-sm">
            {coffee.category}
          </span>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-coffee-brown uppercase tracking-wider">
            {coffee.roastLevel}
          </span>
          <RatingStars rating={coffee.rating || 4.8} reviewCount={coffee.reviewCount} />
        </div>

        <h3 className="heading-serif text-lg font-bold text-dark-espresso line-clamp-1 group-hover:text-caramel transition-colors">
          {coffee.name}
        </h3>

        <p className="mt-1 text-xs text-coffee-brown/80 line-clamp-2">
          {coffee.shortDescription || coffee.description}
        </p>
      </div>

      {/* Footer Price & Add Button */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-cream">
        <div>
          <span className="text-xs text-coffee-brown/60 block leading-none">Price</span>
          <span className="text-lg font-bold text-dark-espresso">{formatPrice(coffee.price)}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 rounded-full bg-caramel px-4 py-2 text-xs font-bold text-cream shadow-sm transition-all hover:bg-coffee-brown active:scale-95"
        >
          <FaShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CoffeeCard;
