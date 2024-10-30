import React, { useState } from 'react';
import axios from 'axios';

const AdvertisementUpload = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('/api/advertisement/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message);
      setImage(null);
    } catch (error) {
      setMessage('Error uploading image');
    }
  };

  return (
    <div>
      <h2>Upload Advertisement Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdvertisementUpload;
