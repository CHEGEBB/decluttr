const express = require('express');
const router = express.Router();

const {
  initiateStkPush,
  mpesaCallback,
  queryStkPush,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/auth');
router.post('/callback', mpesaCallback);
router.post('/initiate', protect, initiateStkPush);
router.post('/status', protect, queryStkPush);
router.get('/status/:orderId', protect, queryStkPush);

module.exports = router;