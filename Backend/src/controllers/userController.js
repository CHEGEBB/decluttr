const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const cloudinary = require('../config/cloudinary'); // Your Cloudinary config

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
          phoneNumber: user.phoneNumber,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings,
          profileImage: user.profileImage,
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
          profileImage: user.profileImage,
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

// Update User Profile with all fields
exports.updateProfile = async (req, res) => {
  try {
    const { name, location, phoneNumber, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (location) user.location = location;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;

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
          phoneNumber: user.phoneNumber,
          location: user.location,
          profileImage: user.profileImage,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings,
          totalIncome: user.totalIncome
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

// Upload Profile Image to Cloudinary
exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    // Delete old profile image from Cloudinary if exists
    if (user.profileImage && user.profileImage.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting old image from Cloudinary:', cloudinaryError);
      }
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'decluttr/profile-images',
        resource_type: 'auto',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Focus on face
          { quality: 'auto:good' }
        ]
      }
    );

    // Update user profile image
    user.profileImage = {
      public_id: result.public_id,
      url: result.secure_url
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update User Profile with Image URL (for when image is uploaded separately)
exports.updateProfileWithImage = async (req, res) => {
  try {
    const { name, location, phoneNumber, email, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (location) user.location = location;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (profileImage) {
      user.profileImage = profileImage;
    }

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
          phoneNumber: user.phoneNumber,
          location: user.location,
          profileImage: user.profileImage,
          totalExchanges: user.totalExchanges,
          ratings: user.ratings,
          totalIncome: user.totalIncome
        }
      }
    });
  } catch (error) {
    console.error('Update profile with image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};