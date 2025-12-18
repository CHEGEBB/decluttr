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

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const products = await Product.find({ 
      seller: user._id,
      isVerified: true
    }).limit(20);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          location: user.location,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings,
          createdAt: user.createdAt
        },
        products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    const user = await User.findOne({ username: username })
      .select('-password -email'); 

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
    })
    .select('name price images category listingType createdAt')
    .limit(20)
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          location: user.location,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings,
          createdAt: user.createdAt
        },
        products,
        productCount: products.length
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

exports.updateProfile = async (req, res) => {
  try {
    const { name, location, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    if (name) user.name = name;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          location: user.location,
          bio: user.bio,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};