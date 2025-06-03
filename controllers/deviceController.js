const Device = require('../models/Device');

exports.addDevice = async (req, res) => {
  const device = await Device.create({ ...req.body, userId: req.user._id });
  res.json(device);
};

exports.getDevices = async (req, res) => {
  const devices = await Device.find({ userId: req.user._id });
  res.json(devices);
};
