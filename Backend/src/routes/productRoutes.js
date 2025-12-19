// routes/productRoutes.js (updated)
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getFeaturedProducts,
  getSimilarProducts,
  getProductStats
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.get('/:id/similar', getSimilarProducts);

// Protected routes
router.use(protect);
router.get('/my/products', getMyProducts);
router.get('/my/stats', getProductStats);
router.post('/', upload.array('images', 5), createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;