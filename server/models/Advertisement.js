const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String, // Stores Cloudinary's public ID for easy deletion
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Advertisement', advertisementSchema);
