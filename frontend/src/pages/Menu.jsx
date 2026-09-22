import React, { useState, useEffect } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import RatingStars from '../components/common/RatingStars';
import SkeletonLoader from '../components/common/SkeletonLoader';
import useCart from '../hooks/useCart';
import { getCoffeesApi } from '../services/coffee.service';
import { formatPrice } from '../utils/formatPrice';

const MENU_CATEGORIES = [
  'All Menu',
  'Espresso',
  'Cappuccino',
  'Latte',
  'Cold Brew',
  'Tea',
  'Pastries',
  'Breakfast',
  'Desserts',
];

const Menu = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'All Menu') {
          params.category = selectedCategory;
        }
        const data = await getCoffeesApi(params);
        setMenuItems(data.coffees || []);
      } catch (err) {
        console.error('Fetch menu error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Freshly Crafted Daily</span>
          <h1 className="heading-serif text-3xl sm:text-4xl font-extrabold text-dark-espresso mt-1">
            Brew Haven Popular Menu
          </h1>
          <p className="text-xs sm:text-sm text-coffee-brown/80 mt-2">
            Explore our curated menu of signature coffees, soothing organic teas, artisanal buttery pastries, and gourmet desserts.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 shadow-sm ${
                selectedCategory === cat
                  ? 'bg-caramel text-cream scale-105 shadow-md'
                  : 'bg-white text-dark-espresso hover:bg-caramel/10 border border-caramel/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : menuItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-card border border-caramel/15">
            <h3 className="heading-serif text-lg font-bold text-dark-espresso">No items found in this category</h3>
            <p className="text-xs text-coffee-brown/70 mt-1">Try selecting another menu tab above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="group flex gap-4 rounded-2xl bg-white p-4 shadow-card border border-caramel/15 transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold text-caramel uppercase tracking-wider">
                        {item.category}
                      </span>
                      <RatingStars rating={item.rating} size="sm" />
                    </div>
                    <h3 className="heading-serif text-base font-bold text-dark-espresso line-clamp-1 group-hover:text-caramel transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-coffee-brown/80 line-clamp-2 mt-0.5">
                      {item.shortDescription || item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream">
                    <span className="text-base font-bold text-dark-espresso">{formatPrice(item.price)}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1.5 rounded-full bg-caramel px-3 py-1.5 text-[11px] font-bold text-cream hover:bg-coffee-brown transition-colors"
                    >
                      <FaShoppingBag className="h-3 w-3" />
                      Add
                    </button>
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

export default Menu;
