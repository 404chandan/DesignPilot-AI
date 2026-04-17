const express = require('express');
const router = express.Router();
const Blueprint = require('../models/Blueprint');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/blueprints
// @desc    Get all blueprints for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const blueprints = await Blueprint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(blueprints);
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
