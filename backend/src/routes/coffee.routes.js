const express = require('express');
const router = express.Router();
const {
  getCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee,
} = require('../controllers/coffee.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.get('/', getCoffees);
router.get('/:id', getCoffeeById);
router.post('/', protect, adminOnly, createCoffee);
router.patch('/:id', protect, adminOnly, updateCoffee);
router.delete('/:id', protect, adminOnly, deleteCoffee);

module.exports = router;
