const express = require('express');

const router = express.Router();

const {
    getDashboardStats,
    getExpiringItems
} = require('../controllers/dashboardController');

const protect = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);

router.get('/expiring', protect, getExpiringItems);

module.exports = router;