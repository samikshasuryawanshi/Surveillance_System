// File: controllers/videoController.js
const Video = require('../models/Video');

// Upload video handler
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Simulate URL from uploaded file
    const videoUrl = `/uploads/${req.file.originalname}`;

    const newVideo = new Video({
      title: req.body.title || req.file.originalname,
      url: videoUrl,
      description: req.body.description || '',
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error uploading video' });
  }
};

// List all videos handler
const listVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
};

// Stream video handler (basic example)
const streamVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Redirect to video URL (demo only)
    res.redirect(video.url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error streaming video' });
  }
};

module.exports = {
  uploadVideo,
  listVideos,
  streamVideo,
};
