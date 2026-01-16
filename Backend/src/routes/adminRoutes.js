const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  getUser,
  deleteUser,
  toggleUserStatus,
  getPendingProducts,
  getAllProducts,
  verifyProduct,
  deleteProduct,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getPlatformStats,
  getAllTransactions,
  search
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getAdminDashboard);
router.get('/stats', getPlatformStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-status', toggleUserStatus);

// Products
router.get('/products', getAllProducts);
router.get('/products/pending', getPendingProducts);
router.put('/products/:id/verify', verifyProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrder);
router.put('/orders/:id/status', updateOrderStatus);

// Transactions
router.get('/transactions', getAllTransactions);

// Search
router.get('/search', search);

module.exports = router;