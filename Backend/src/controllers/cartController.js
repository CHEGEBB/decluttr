const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'username name'
        }
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    let totalPrice = 0;
    const validItems = cart.items.filter(item => {
      if (item.product && item.product.status === 'available') {
        if (item.product.listingType === 'resale') {
          totalPrice += item.product.price;
        }
        return true;
      }
      return false;
    });

    cart.items = validItems;
    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        cart,
        totalPrice,
        shippingFee: 600,
        grandTotal: totalPrice + 600
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'This product is no longer available'
      });
    }

    if (!product.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This product is awaiting admin verification'
      });
    }

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add your own product to cart'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in cart'
      });
    }

    cart.items.push({ product: productId });
    await cart.save();

    await cart.populate({
      path: 'items.product',
      populate: {
        path: 'seller',
        select: 'username name'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product to cart',
      error: error.message
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      populate: {
        path: 'seller',
        select: 'username name'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from cart',
      error: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};