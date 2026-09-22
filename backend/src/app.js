const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorHandler = require('./middleware/error.middleware');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const coffeeRoutes = require('./routes/coffee.routes');
const cartRoutes = require('./routes/cart.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const contactRoutes = require('./routes/contact.routes');
const reviewRoutes = require('./routes/review.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coffees', coffeeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Brew Haven Backend Server Operating Smoothly ☕' });
});

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Cannot find route ${req.originalUrl} on server` });
});

// Centralized Error Middleware
app.use(errorHandler);

module.exports = app;
