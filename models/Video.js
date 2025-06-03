const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  name: String,
  filePath: String, // Cloudinary URL
  localPath: String, // Optional local path
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);