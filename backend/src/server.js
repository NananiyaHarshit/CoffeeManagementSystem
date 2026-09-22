require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Create HTTP Server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO Real-time Connection Handler
io.on('connection', (socket) => {
  console.log(`⚡ Socket client connected: ${socket.id}`);

  socket.on('join_chat', (userId) => {
    socket.join(`chat_${userId}`);
    console.log(`User joined socket room: chat_${userId}`);
  });

  socket.on('send_message', (data) => {
    // Broadcast message to room
    io.to(`chat_${data.userId}`).emit('receive_message', data.message);
  });

  socket.on('disconnect', () => {
    console.log(`🔥 Socket client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`☕ BREW HAVEN BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
});
