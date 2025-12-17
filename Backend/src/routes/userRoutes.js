const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(protect);
router.get('/dashboard', userController.getDashboard);
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;