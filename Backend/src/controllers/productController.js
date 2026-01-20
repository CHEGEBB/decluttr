// controllers/productController.js (FIXED - includes phoneNumber everywhere)
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      listingType, 
      price,
      condition,
      location,
      brand,
      model,
      color,
      size,
      material,
      warranty,
      tags,
      specifications
    } = req.body;

    if (!name || !description || !category || !listingType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        errors: ['Name, description, category, and listing type are required']
      });
    }

    if (listingType === 'resale' && (!price || price <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid price for resale items'
      });
    }

    const validCategories = ['Books', 'Electronics', 'Shoes', 'Clothes', 'Furniture', 'Accessories', 'Sports', 'Home', 'Arts', 'Entertainment'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected',
        errors: [`Category must be one of: ${validCategories.join(', ')}`]
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'decluttr/products',
            resource_type: 'auto',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    let parsedSpecifications = {};
    if (specifications) {
      try {
        if (typeof specifications === 'string') {
          parsedSpecifications = JSON.parse(specifications);
        } else {
          parsedSpecifications = specifications;
        }
      } catch (error) {
        console.error('Error parsing specifications:', error);
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      listingType,
      price: listingType === 'resale' ? parseFloat(price) : 0,
      images,
      seller: req.user._id,
      condition: condition || 'Good',
      location: location || req.user.location,
      brand: brand || undefined,
      model: model || undefined,
      color: color || undefined,
      size: size || undefined,
      material: material || undefined,
      warranty: warranty || undefined,
      tags: parsedTags,
      specifications: parsedSpecifications
    });

    // ✅ ALREADY CORRECT - includes phoneNumber
    await product.populate('seller', 'name username email location ratings totalExchanges phoneNumber');

    res.status(201).json({
      success: true,
      message: 'Product created successfully. Awaiting admin verification.',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { 
      category, 
      listingType, 
      search, 
      page = 1, 
      limit = 12, 
      verified = 'true',
      minPrice,
      maxPrice,
      condition,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    if (location && location !== 'all') {
      query.location = location;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'views') {
      sortOptions.views = -1;
    } else if (sortBy === 'rating') {
      sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ✅ ALREADY CORRECT - includes phoneNumber
    const products = await Product.find(query)
      .populate('seller', 'name username email location ratings totalExchanges phoneNumber')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const count = await Product.countDocuments(query);
    const totalPages = Math.ceil(count / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: count,
        totalPages,
        currentPage: pageNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    // ✅ ALREADY CORRECT - includes phoneNumber
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name username email phoneNumber location ratings totalExchanges');

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
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.updateProduct = async (req, res) => {
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
        message: 'Not authorized to update this product'
      });
    }

    if (product.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a sold product'
      });
    }

    const allowedUpdates = [
      'name', 'description', 'category', 'listingType', 'price', 
      'condition', 'brand', 'model', 'color', 'size', 'material',
      'warranty', 'tags', 'specifications', 'location'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.listingType === 'donation' && updates.price !== undefined) {
      updates.price = 0;
    }

    // ✅ FIXED - Added phoneNumber
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'name username email location ratings totalExchanges phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    // ✅ FIXED - Added phoneNumber
    const products = await Product.find({ seller: req.user._id })
      .populate('seller', 'name username email location ratings totalExchanges phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    // ✅ FIXED - Added email, totalExchanges, and phoneNumber
    const products = await Product.find({ 
      isVerified: true, 
      status: 'available' 
    })
      .populate('seller', 'name username email location ratings totalExchanges phoneNumber')
      .sort({ views: -1, createdAt: -1 })
      .limit(12);

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // ✅ FIXED - Added email, totalExchanges, and phoneNumber
    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isVerified: true,
      status: 'available'
    })
      .populate('seller', 'name username email location ratings totalExchanges phoneNumber')
      .limit(4);

    res.status(200).json({
      success: true,
      data: similarProducts
    });
  } catch (error) {
    console.error('Get similar products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch similar products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getProductStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Product.aggregate([
      { $match: { seller: userId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalSold: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] 
            } 
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$status', 'sold'] },
                  { $eq: ['$listingType', 'resale'] }
                ]},
                '$price',
                0
              ]
            }
          },
          categories: { $push: '$category' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalProducts: 0,
          totalViews: 0,
          totalSold: 0,
          totalRevenue: 0,
          categoryDistribution: {}
        }
      });
    }

    const categoryDistribution = {};
    stats[0].categories?.forEach(category => {
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts: stats[0].totalProducts || 0,
        totalViews: stats[0].totalViews || 0,
        totalSold: stats[0].totalSold || 0,
        totalRevenue: stats[0].totalRevenue || 0,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};