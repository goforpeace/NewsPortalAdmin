const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true
})

class authController {
    login = async (req, res) => {
        const { email, password } = req.body

        if (!email) {
            return res.status(404).json({ message: 'Please provide your email' })
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide your password' })
        }

        try {
            const user = await authModel.findOne({ email }).select('+password')
            if (user) {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    const obj = {
                        id: user.id,
                        name: user.name,
                        category: user.category,
                        role: user.role
                    }
                    const token = await jwt.sign(obj, process.env.secret, {
                        expiresIn: process.env.exp_time
                    })
                    return res.status(200).json({ message: 'login success', token })
                } else {
                    return res.status(404).json({ message: 'invalid password' })
                }
            } else {
                return res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.log(error)
        }

    }

    add_writer = async (req, res) => {

        const { email, name, password, category } = req.body

        if (!name) {
            return res.status(404).json({ message: 'please provide name' })
        }
        if (!password) {
            return res.status(404).json({ message: 'please provide password' })
        }
        if (!category) {
            return res.status(404).json({ message: 'please provide category' })
        }
        if (!email) {
            return res.status(404).json({ message: 'please provide email' })
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'please provide valide email' })
        }
        try {
            const writer = await authModel.findOne({ email: email.trim() })
            if (writer) {
                return res.status(404).json({ message: 'User alreasy exit' })
            } else {
                const new_writer = await authModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    category: category.trim(),
                    role: 'writer'
                })
                return res.status(201).json({ message: 'writer add success', writer: new_writer })
            }
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    get_writers = async (req, res) => {
        try {
            const writers = await authModel.find({ role: "writer" }).sort({ createdAt: -1 })
            return res.status(200).json({ writers })
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    changePassword = async (req, res) => {
        const { old_password, new_password } = req.body;
        const userId = req.userInfo.id;
    
        if (!old_password || !new_password) {
            return res.status(400).json({ message: 'Please provide both old and new passwords.' });
        }
    
        try {
            const user = await authModel.findById(userId).select('+password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const isMatch = await bcrypt.compare(old_password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
    
            user.password = await bcrypt.hash(new_password, 10);
            await user.save();
            return res.status(200).json({ message: 'Password changed successfully' });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    uploadProfileImage = async (req, res) => {
        try {
            const file = req.files.images; // Assuming you use multer or another file upload middleware
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'profile_images', // Optional folder for organization
                public_id: `profile_${req.userInfo.id}`, // Optional naming convention
            });

            // Update user profile image URL in the database
            await authModel.findByIdAndUpdate(req.userInfo.id, { profileImage: result.secure_url });

            return res.status(200).json({ message: 'Image uploaded successfully', imageUrl: result.secure_url });
        } catch (error) {
            console.error('Image upload error:', error);
            return res.status(500).json({ message: 'Image upload failed' });
        }
    };

    

}

module.exports = new authController()
