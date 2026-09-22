import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Coffee from '../pages/Coffee';
import CoffeeDetails from '../pages/CoffeeDetails';
import Menu from '../pages/Menu';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Favorites from '../pages/Favorites';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import TrackOrder from '../pages/TrackOrder';
import Chat from '../pages/Chat';
import PaymentSuccess from '../pages/PaymentSuccess';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coffee" element={<Coffee />} />
      <Route path="/coffee/:id" element={<CoffeeDetails />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
