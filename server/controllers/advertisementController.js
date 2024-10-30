const Advertisement = require('../models/Advertisement');
const cloudinary = require('../config/cloudinary');

// Upload advertisement image
exports.uploadAdvertisement = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'advertisements'
    });

    const newAdvertisement = new Advertisement({
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

    await newAdvertisement.save();

    res.status(201).json({
      message: 'Advertisement uploaded successfully',
      advertisement: newAdvertisement
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading advertisement', error });
  }
};

// Get latest advertisement
exports.getLatestAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne().sort({ createdAt: -1 });
    res.json(advertisement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisement', error });
  }
};
