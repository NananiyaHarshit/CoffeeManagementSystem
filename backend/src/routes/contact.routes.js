const express = require('express');
const router = express.Router();
const { createContactMessage } = require('../controllers/contact.controller');

router.post('/', createContactMessage);

module.exports = router;
