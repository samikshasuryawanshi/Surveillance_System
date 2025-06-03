const mongoose = require('mongoose');
const DeviceSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String
});
module.exports = mongoose.model('Device', DeviceSchema);
