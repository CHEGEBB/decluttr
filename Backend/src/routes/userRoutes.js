const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(protect);
router.get('/dashboard', userController.getDashboard);
router.get('/me/profile', userController.getMyProfile);
router.put('/me/profile', userController.updateProfile);
router.get('/profile/:username', userController.getUserProfile);


module.exports = router;