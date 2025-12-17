const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/received', getReceivedOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;