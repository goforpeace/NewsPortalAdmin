const express = require('express');
const router = express.Router();

// Sample route to get the latest advertisement
router.get('/latest', async (req, res) => {
  try {
    // Replace with your actual database call to get the latest advertisement
    const advertisement = {
      imageUrl: 'https://example.com/latest-ad.jpg', // sample URL
    };
    res.json(advertisement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch advertisement' });
  }
});

module.exports = router;
