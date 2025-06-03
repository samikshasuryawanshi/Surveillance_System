const Device = require('../models/Device');

exports.listDevices = async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user._id });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get devices' });
  }
};

exports.addDevice = async (req, res) => {
  try {
    const { name, type } = req.body;
    const device = await Device.create({
      user: req.user._id,
      name,
      type,
      status: 'offline',
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add device' });
  }
};