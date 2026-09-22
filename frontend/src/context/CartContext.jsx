import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi } from '../services/cart.service';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('brew_haven_cart');
    return localData ? JSON.parse(localData) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync cart from backend when user logs in
  useEffect(() => {
    const syncBackendCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await getCartApi();
          if (res.cart && res.cart.items) {
            const formatted = res.cart.items.map((i) => ({
              id: i._id,
              productId: i.product._id,
              name: i.product.name,
              price: i.product.price,
              image: i.product.images[0],
              quantity: i.quantity,
              size: i.size,
            }));
            setCartItems(formatted);
          }
        } catch (error) {
          console.error('Cart sync error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    syncBackendCart();
  }, [user]);

  // Persist guest cart in localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('brew_haven_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1, size = 'Medium (350ml)') => {
    if (user) {
      try {
        await addToCartApi({ productId: product._id, quantity, size });
        const res = await getCartApi();
        const formatted = res.cart.items.map((i) => ({
          id: i._id,
          productId: i.product._id,
          name: i.product.name,
          price: i.product.price,
          image: i.product.images[0],
          quantity: i.quantity,
          size: i.size,
        }));
        setCartItems(formatted);
        toast.success(`Added ${product.name} to cart!`);
      } catch (err) {
        toast.error('Failed to add item to cart');
      }
    } else {
      setCartItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === product._id && i.size === size);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              id: `guest_${Date.now()}_${Math.random()}`,
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity,
              size,
            },
          ];
        }
      });
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (user) {
      try {
        await updateCartItemApi(itemId, newQty);
        setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)));
      } catch (err) {
        toast.error('Failed to update quantity');
      }
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        await removeCartItemApi(itemId);
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        toast.info('Item removed from cart');
      } catch (err) {
        toast.error('Failed to remove item');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.info('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await clearCartApi();
      } catch (err) {
        // Continue
      }
    }
    setCartItems([]);
    localStorage.removeItem('brew_haven_cart');
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 500 || cartItems.length === 0 ? 0 : 49;
  const total = subtotal + tax + shippingFee;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        shippingFee,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
