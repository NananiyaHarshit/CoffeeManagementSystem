const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['user', 'support', 'bot'], default: 'user' },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    messages: [messageSchema],
    status: {
      type: String,
      enum: ['open', 'resolved', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
