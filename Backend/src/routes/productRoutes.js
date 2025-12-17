const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');


router.get('/my/products', protect, getMyProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.array('images', 5), createProduct);

router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;