const router = require('express').Router()
const authController = require('../controllers/authControllers')
const middleware = require('../middlewares/middleware')

const upload = require('../middlewares/uploadMiddleware'); // Middleware for file uploads


// const multer = require('multer'); // or any other middleware for file handling

// const upload = multer({ dest: 'uploads/' }); // Temporary storage location



router.post('/api/login', authController.login)
router.post('/api/news/writer/add',middleware.auth,middleware.role, authController.add_writer)
router.get('/api/news/writers',middleware.auth,middleware.role, authController.get_writers)
router.post('/api/change-password', middleware.auth, authController.changePassword)
router.post('/api/upload-profile-image', middleware.auth, upload.single('images'), authController.uploadProfileImage);

module.exports = router
