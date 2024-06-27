const express = require('express');
const postController = require('../controllers/postController');
const multer = require('multer');
const path = require('path');  // Add this line
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the original file extension
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);

module.exports = router;
