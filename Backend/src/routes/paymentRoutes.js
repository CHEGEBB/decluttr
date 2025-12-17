const express = require('express');
const router = express.Router();

const {
  initiateStkPush: initiatePayment,
  mpesaCallback,
  queryStkPush: checkPaymentStatus,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/auth');

router.post('/callback', mpesaCallback);
router.post('/initiate', protect, initiatePayment);
router.get('/status/:orderId', protect, checkPaymentStatus); 

module.exports = router;