const mongoose = require('mongoose');
const VideoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  path: String,
  timestamp: Date
});
module.exports = mongoose.model('Video', VideoSchema);
