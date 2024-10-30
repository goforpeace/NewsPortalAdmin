import React, { useContext, useState } from 'react';
import { FaImage } from "react-icons/fa6";
import axios from 'axios';
import storeContext from '../../context/storeContext';
import { base_url } from '../../config/config'; // Assuming you have a config for your base URL
import toast from 'react-hot-toast';

const Profile = () => {
    const { store } = useContext(storeContext);
    
    // State to manage selected profile image and password fields
    const [selectedImage, setSelectedImage] = useState(null);
    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: ''
    });
    const [loading, setLoading] = useState(false);

    // Function to handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file); // Use the actual File object
        }
    }    

    // Function to handle password input change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
    }

    // Function to upload the profile image
    const uploadImage = async () => {
        if (!selectedImage) {
            toast.error("Please select an image.");
            return;
        }
    
        const formData = new FormData();
        formData.append('images', selectedImage);
    
        try {
            setLoading(true);
            const { data } = await axios.post(`${base_url}/api/upload-profile-image`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${store.token}`
                }
            });
            toast.success("Profile image uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload profile image.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    

    // Function to change password
    const changePassword = async () => {
        if (!passwords.old_password || !passwords.new_password) {
            toast.error("Please fill out both password fields.");
            return;
        }
    
        try {
            setLoading(true);
            const { data } = await axios.post(`${base_url}/api/change-password`, passwords, {
                headers: { Authorization: `Bearer ${store.token}` }
            });
            toast.success("Password changed successfully!");
        } catch (error) {
            toast.error("Failed to change password.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <div className='w-full grid grid-cols-2 gap-x-6 mt-5'>
            <div className='bg-white gap-x-3 p-6 rounded flex justify-center items-center'>
                <div>
                    <label htmlFor="img" className={`w-[150px] h-[150px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed`}>
                        <div className='flex justify-center items-center flex-col gap-y-2'>
                            {selectedImage ? (
                                <img src={selectedImage} alt="Selected" className='w-full h-full object-cover rounded' />
                            ) : (
                                <>
                                    <span className='text-2xl'><FaImage /></span>
                                    <span>Select Image</span>
                                </>
                            )}
                        </div>
                    </label>
                    <input className='hidden' type="file" id='img' onChange={handleImageChange} />
                </div>
                <div className='text-[#404040] flex flex-col gap-y-1 justify-center items-start'>
                    {/* Display user's name and email */}
                    <span>Name: {store.userInfo?.name || "Unknown"}</span>
                    <span>Email: {store.userInfo?.email || "Unknown"}</span>
                    <span>Category: {store.userInfo?.role === 'admin' ? 'All' : 'Sports'}</span>
                </div>
            </div>
            <div className='bg-white px-6 py-4 text-[#404040]'>
                <h2 className='pb-3 text-center'>Change Password</h2>
                <form>
                    <div className='grid grid-cols-1 gap-y-5 mb-3'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-md font-medium text-gray-600' htmlFor="old_password">Old Password</label>
                            <input
                                type="password"
                                placeholder='Old password'
                                name='old_password'
                                className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10'
                                id='old_password'
                                value={passwords.old_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-md font-medium text-gray-600' htmlFor="new_password">New Password</label>
                            <input
                                type="password"
                                placeholder='New password'
                                name='new_password'
                                className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10'
                                id='new_password'
                                value={passwords.new_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <button
                            type='button'
                            className='px-3 py-[6px] bg-purple-500 rounded-sm text-white hover:bg-purple-600'
                            onClick={changePassword}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Change Password"}
                        </button>
                        <button
                            type='button'
                            className='px-3 py-[6px] bg-green-500 rounded-sm text-white hover:bg-green-600'
                            onClick={uploadImage}
                            disabled={loading}
                        >
                            {loading ? "Uploading..." : "Upload Image"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
