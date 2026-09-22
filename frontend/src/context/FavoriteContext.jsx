import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await api.get('/favorites');
          setFavorites(res.data.favorites || []);
        } catch (err) {
          console.error('Fetch favorites error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user]);

  const isFavorite = (productId) => {
    return favorites.some((item) => (typeof item === 'object' ? item._id === productId : item === productId));
  };

  const toggleFavorite = async (product) => {
    if (!user) {
      toast.info('Please log in to save your favorite coffees!');
      return false;
    }

    const productId = product._id || product;
    const isFav = isFavorite(productId);

    try {
      if (isFav) {
        const res = await api.delete(`/favorites/${productId}`);
        setFavorites(res.data.favorites || []);
        toast.info('Removed from favorites');
      } else {
        const res = await api.post(`/favorites/${productId}`);
        setFavorites(res.data.favorites || []);
        toast.success('Added to your favorite coffees!');
      }
      return true;
    } catch (err) {
      toast.error('Failed to update favorites');
      return false;
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorites must be used within a FavoriteProvider');
  return context;
};
