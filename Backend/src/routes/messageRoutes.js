const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/conversation/:userId', getConversation);
router.post('/send', sendMessage);
router.put('/:conversationId/read', markAsRead);

module.exports = router;