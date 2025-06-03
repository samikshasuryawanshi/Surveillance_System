const Video = require('../models/Video');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('video');

exports.uploadVideo = async (req, res) => {
  const video = await Video.create({
    userId: req.user._id,
    deviceId: req.body.deviceId,
    path: req.file.path,
    timestamp: new Date()
  });
  res.json(video);
};

exports.getVideos = async (req, res) => {
  const videos = await Video.find({ userId: req.user._id });
  res.json(videos);
};
