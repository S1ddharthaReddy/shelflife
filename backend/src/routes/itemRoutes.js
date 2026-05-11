
const express = require("express");
const router = express.Router();

const { createItem, getItems, updateItem, updateItemStatus, deleteItem } = require("../controllers/itemController");

const protect = require('../middleware/authMiddleware');

router.post('/', protect, createItem);
router.get('/', protect, getItems);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/status', protect, updateItemStatus);


module.exports = router;