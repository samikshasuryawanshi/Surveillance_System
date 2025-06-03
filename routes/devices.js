const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// Mock auth middleware — replace with real authentication logic!
const authenticate = (req, res, next) => {
  // For testing, hardcode a userId; replace this with real auth user ID
  req.user = { _id: '64fc3b5a8a2f9b3f66d7f123' }; 
  next();
};

router.post('/register', authenticate, async (req, res) => {
  try {
    const { deviceName } = req.body;
    if (!deviceName) {
      return res.status(400).json({ error: 'Device name is required' });
    }

    const device = new Device({
      userId: req.user._id,
      name: deviceName
    });

    await device.save();

    res.status(201).json({ message: 'Device registered', device });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;