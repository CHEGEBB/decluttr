const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || product.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product.name}" is no longer available`
        });
      }

      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        price: product.listingType === 'resale' ? product.price : 0,
        listingType: product.listingType,
        category: product.category
      });

      if (product.listingType === 'resale') {
        totalAmount += product.price;
      }
    }

    const shippingFee = 600;
    totalAmount += shippingFee;

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      shippingAddress,
      shippingFee,
      totalAmount
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { status: 'pending' });
    }

    cart.items = [];
    await cart.save();

    await order.populate([
      { path: 'buyer', select: 'name email phoneNumber location' },
      { path: 'items.seller', select: 'name username phoneNumber' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully. Please proceed to payment.',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('buyer', 'name email phoneNumber location')
      .populate('items.seller', 'name username phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

exports.getReceivedOrders = async (req, res) => {
  try {
    console.log('🔍 getReceivedOrders - User ID:', req.user._id);
    console.log('🔍 getReceivedOrders - User ID toString:', req.user._id.toString());

    // Find all orders that contain items where this user is the seller
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('buyer', 'name email phoneNumber location')
      .populate('items.seller', 'name username phoneNumber')
      .sort({ createdAt: -1 });

    console.log('🔍 Orders found (before filtering):', orders.length);

    // Filter to only include items where the current user is the seller
    const filteredOrders = orders.map(order => {
      const relevantItems = order.items.filter(item => {
        // Handle both populated and non-populated seller
        const sellerId = item.seller._id ? item.seller._id.toString() : item.seller.toString();
        const userId = req.user._id.toString();
        console.log('🔍 Comparing seller:', sellerId, 'with user:', userId);
        return sellerId === userId;
      });

      console.log('🔍 Order:', order._id, '- Relevant items:', relevantItems.length);

      return {
        ...order.toObject(),
        items: relevantItems
      };
    }).filter(order => order.items.length > 0); // Only return orders with relevant items

    console.log('🔍 Orders after filtering:', filteredOrders.length);

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders
    });
  } catch (error) {
    console.error('❌ getReceivedOrders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch received orders',
      error: error.message
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phoneNumber location')
      .populate('items.seller', 'name username phoneNumber location');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => {
      const sellerId = item.seller._id ? item.seller._id.toString() : item.seller.toString();
      return sellerId === req.user._id.toString();
    });

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const isSeller = order.items.some(item => {
      const sellerId = item.seller._id ? item.seller._id.toString() : item.seller.toString();
      return sellerId === req.user._id.toString();
    });

    if (!isSeller && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'delivered') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { 
          status: 'sold',
          isOrdered: true
        });
      }

      for (const item of order.items) {
        const sellerId = item.seller._id || item.seller;
        await User.findByIdAndUpdate(sellerId, {
          $inc: {
            totalIncome: item.price,
            totalExchanges: 1
          }
        });
      }
    } else if (orderStatus === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { status: 'available' });
      }
    }

    await order.save();

    // Populate before sending response
    await order.populate([
      { path: 'buyer', select: 'name email phoneNumber location' },
      { path: 'items.seller', select: 'name username phoneNumber' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};