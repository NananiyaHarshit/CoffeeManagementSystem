const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.get('/:id/track', trackOrder); // Public order tracking lookup

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
