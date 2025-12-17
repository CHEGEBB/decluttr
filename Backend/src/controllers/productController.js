const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, listingType, price } = req.body;

    if (!name || !description || !category || !listingType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (listingType === 'resale' && (!price || price <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid price for resale items'
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'decluttr/products',
            resource_type: 'auto'
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }
    const product = await Product.create({
      name,
      description,
      category,
      listingType,
      price: listingType === 'resale' ? price : 0,
      images,
      seller: req.user._id
    });

    await product.populate('seller', 'name username email location');

    res.status(201).json({
      success: true,
      message: 'Product created successfully. Awaiting admin verification.',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, listingType, search, page = 1, limit = 6, verified = 'true' } = req.query;

    const query = {};
    
    if (verified === 'true') {
      query.isVerified = true;
    }
    
    query.status = 'available';

    if (category && category !== 'all') {
      query.category = category;
    }

    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'username name location ratings')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'username name email phoneNumber location ratings totalExchanges');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your products',
      error: error.message
    });
  }
};