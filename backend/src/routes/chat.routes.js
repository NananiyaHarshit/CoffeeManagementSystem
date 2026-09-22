const express = require('express');
const router = express.Router();
const { getMyChat, sendChatMessage } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getMyChat);
router.post('/message', sendChatMessage);

module.exports = router;
