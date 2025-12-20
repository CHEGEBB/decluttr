// Add these routes to userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // Your upload middleware

router.use(protect);
router.get('/dashboard', userController.getDashboard);
router.get('/me/profile', userController.getMyProfile);
router.put('/me/profile', userController.updateProfile);
router.post('/upload-profile-image', upload.single('profileImage'), userController.uploadProfileImage);
router.get('/profile/:username', userController.getUserProfile);

module.exports = router;