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
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};