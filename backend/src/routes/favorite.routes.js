const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getFavorites);
router.post('/:productId', addFavorite);
router.delete('/:productId', removeFavorite);

module.exports = router;
