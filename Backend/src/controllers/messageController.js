const Message = require('../models/Message');
const User = require('../models/User');


exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('sender', 'name username')
    .populate('receiver', 'name username')
    .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach(msg => {
      if (!conversationsMap.has(msg.conversationId)) {
        const otherUser = msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver
          : msg.sender;

        conversationsMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }
    });

    for (const [convId, conv] of conversationsMap) {
      const unreadCount = await Message.countDocuments({
        conversationId: convId,
        receiver: req.user._id,
        isRead: false
      });
      conv.unreadCount = unreadCount;
    }

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const conversationId = Message.generateConversationId(req.user._id, otherUserId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name username')
      .populate('receiver', 'name username')
      .populate('product', 'name images')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversationId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      data: {
        conversationId,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          username: otherUser.username
        },
        messages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, productId } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver and message'
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    const conversationId = Message.generateConversationId(req.user._id, receiverId);

    const newMessage = await Message.create({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      message,
      product: productId || null
    });

    await newMessage.populate([
      { path: 'sender', select: 'name username' },
      { path: 'receiver', select: 'name username' },
      { path: 'product', select: 'name images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    if (!conversationId || !conversationId.includes('_')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID format'
      });
    }
    const allMessages = await Message.find({ conversationId });
    
    if (allMessages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const unreadMessages = await Message.find({
      conversationId: conversationId,
      receiver: userId,
      isRead: false
    });

    allMessages.forEach((msg, index) => {
      console.log(`Message ${index + 1}:`, {
        sender: msg.sender.toString(),
        receiver: msg.receiver.toString(),
        isRead: msg.isRead,
        isCurrentUserReceiver: msg.receiver.toString() === userId.toString()
      });
    });

    const result = await Message.updateMany(
      {
        conversationId: conversationId,
        receiver: userId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.status(200).json({
      success: true,
      message: result.modifiedCount > 0 
        ? `${result.modifiedCount} message(s) marked as read` 
        : 'No unread messages to mark',
      data: {
        modifiedCount: result.modifiedCount,
        conversationId: conversationId,
        debug: {
          totalMessages: allMessages.length,
          unreadForYou: unreadMessages.length,
          yourUserId: userId.toString()
        }
      }
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};