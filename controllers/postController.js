const { Post } = require('../models');

const createPost = async (req, res) => {
    try {
      const { groupId, caption, isPublic } = req.body;
      const createdBy = req.user.uid;
      const createdByUsername = req.user.email.split('@')[0];
      const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null; // Update to use req.file
  
      const newPost = await Post.create({
        group_id: groupId,
        caption,
        created_by: createdBy,
        created_by_username: createdByUsername,
        image_url: imageUrl,
        is_public: isPublic
      });
  
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};
