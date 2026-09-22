const Chat = require('../models/Chat.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getMyChat = asyncHandler(async (req, res) => {
  let chat = await Chat.findOne({ user: req.user.id });

  if (!chat) {
    chat = await Chat.create({
      user: req.user.id,
      messages: [
        {
          sender: req.user.id,
          senderName: 'Brew Haven Concierge',
          senderRole: 'support',
          text: `Hello ${req.user.name}! Welcome to Brew Haven. How can we assist with your coffee experience today?`,
        },
      ],
    });
  }

  res.status(200).json({
    success: true,
    chat,
  });
});

const sendChatMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    throw new ApiError(400, 'Message text cannot be empty');
  }

  let chat = await Chat.findOne({ user: req.user.id });
  if (!chat) {
    chat = await Chat.create({ user: req.user.id, messages: [] });
  }

  const userMsg = {
    sender: req.user.id,
    senderName: req.user.name,
    senderRole: 'user',
    text: text.trim(),
    timestamp: new Date(),
  };

  chat.messages.push(userMsg);

  // Auto-respond with concierge bot response if user asks a common question
  const lower = text.toLowerCase();
  let botReplyText = null;

  if (lower.includes('track') || lower.includes('order') || lower.includes('delivery')) {
    botReplyText = 'You can track your active coffee orders live on your profile page or by visiting /track-order with your Order ID!';
  } else if (lower.includes('menu') || lower.includes('coffee') || lower.includes('roast')) {
    botReplyText = 'Our master roaster recommends trying our signature House Blend Espresso or Cold Brew Vanilla Cream!';
  } else if (lower.includes('shipping') || lower.includes('free') || lower.includes('charge')) {
    botReplyText = 'We offer FREE express delivery on all orders over ₹500!';
  } else {
    botReplyText = 'Thank you for reaching out! A Brew Haven coffee specialist is reviewing your message and will reply shortly.';
  }

  const botMsg = {
    sender: req.user.id,
    senderName: 'Brew Haven Concierge',
    senderRole: 'support',
    text: botReplyText,
    timestamp: new Date(Date.now() + 500),
  };

  chat.messages.push(botMsg);
  await chat.save();

  res.status(200).json({
    success: true,
    message: 'Message sent',
    chat,
  });
});

module.exports = {
  getMyChat,
  sendChatMessage,
};
