const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    const receivedOrders = await Order.find({ 'items.seller': req.user._id })
      .populate('buyer', 'name username')
      .sort({ createdAt: -1 })
      .limit(10);

    const filteredOrders = receivedOrders.map(order => {
      const relevantItems = order.items.filter(
        item => item.seller.toString() === req.user._id.toString()
      );
      return {
        _id: order._id,
        buyer: order.buyer,
        items: relevantItems,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      };
    }).filter(order => order.items.length > 0);

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          location: user.location,
          phoneNumber: user.phoneNumber,
          totalIncome: user.totalIncome,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings
        },
        products,
        recentOrders: filteredOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, location, phoneNumber } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (location) user.location = location;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const products = await Product.find({ 
      seller: user._id,
      isVerified: true,
      status: 'available'
    }).limit(20);

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          username: user.username,
          location: user.location,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings
        },
        products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};