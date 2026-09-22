const Contact = require('../models/Contact.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'Name, email, subject, and message are required');
  }

  const contact = await Contact.create({
    name,
    email,
    phone: phone || '',
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Our baristas will get back to you shortly.',
    contact,
  });
});

module.exports = {
  createContactMessage,
};
