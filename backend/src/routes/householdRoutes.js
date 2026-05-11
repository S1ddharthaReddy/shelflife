
const express = require("express");
const router = express.Router();

const {
    createHousehold,
    joinHousehold,
    getMyHousehold,
    getMembers,
    leaveHousehold
  } = require('../controllers/householdController');

  const protect = require("../middleware/authMiddleware");

  router.post('/', protect, createHousehold);
  router.post('/join', protect, joinHousehold);
  router.get('/me', protect, getMyHousehold);
  router.get('/:id/members', protect, getMembers);
  router.post('/leave', protect, leaveHousehold);

  module.exports = router;