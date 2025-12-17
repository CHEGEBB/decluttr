const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getPendingProducts,
  verifyProduct,
  getAllUsers,
  getAllOrders,
  deleteProduct,
  deleteUser
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

router.use(protect);
router.use(isAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/products/pending', getPendingProducts);
router.put('/products/:id/verify', verifyProduct);
router.delete('/products/:id', deleteProduct);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);

module.exports = router;