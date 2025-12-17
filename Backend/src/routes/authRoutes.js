const express = require('express');
const router = express.Router();
const { signup, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

console.log(' Auth routes loaded');

router.post('/signup', (req, res, next) => {
  console.log('POST /api/auth/signup hit');
  next();
}, signup);

router.post('/login', (req, res, next) => {
  console.log('POST /api/auth/login hit');
  next();
}, login);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;