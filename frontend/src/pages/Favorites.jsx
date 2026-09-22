import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import CoffeeCard from '../components/coffee/CoffeeCard';
import useFavorites from '../hooks/useFavorites';
import useAuth from '../hooks/useAuth';

const Favorites = () => {
  const { favorites, loading } = useFavorites();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <FiHeart className="mx-auto h-16 w-16 text-caramel mb-4" />
          <h2 className="heading-serif text-2xl font-bold text-dark-espresso">Your Favorite Coffees</h2>
          <p className="text-xs text-coffee-brown/80 mt-2 mb-6">
            Log in to your Brew Haven account to view and manage your saved coffee roasts.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-caramel px-8 py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-caramel uppercase tracking-widest">Saved Roasts</span>
          <h1 className="heading-serif text-3xl font-extrabold text-dark-espresso mt-0.5">
            My Favorites ({favorites.length})
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-caramel border-t-transparent mb-2"></div>
            <p className="text-xs font-bold text-dark-espresso">Loading your saved coffees...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-card border border-caramel/15 max-w-md mx-auto">
            <FiHeart className="mx-auto h-12 w-12 text-caramel/40 mb-3" />
            <h3 className="heading-serif text-xl font-bold text-dark-espresso">No Favorites Saved Yet</h3>
            <p className="text-xs text-coffee-brown/80 mt-1 mb-6">
              Browse our artisanal coffees and tap the heart icon to save your favorite roasts!
            </p>
            <Link
              to="/coffee"
              className="inline-flex items-center gap-2 rounded-full bg-caramel px-6 py-2.5 text-xs font-bold text-cream hover:bg-coffee-brown transition-colors"
            >
              Explore Coffee Catalog
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((coffee) => (
              <CoffeeCard key={coffee._id || coffee} coffee={coffee} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
