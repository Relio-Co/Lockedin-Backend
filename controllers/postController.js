const { Post, User, Comment, Like } = require('../models');

const createPost = async (req, res) => {
  try {
    const { groupId, caption, isPublic } = req.body;
    const createdBy = req.user.uid;
    const createdByUsername = req.user.email.split('@')[0];
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    // Check if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(400).json({ error: 'Group not found' });
    }

    const newPost = await Post.create({
      group_id: groupId,
      caption,
      created_by: createdBy,
      created_by_username: createdByUsername,
      image_url: imageUrl,
      is_public: isPublic,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
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

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId, {
      include: [
        { model: User, attributes: ['username', 'profile_picture'] },
        { model: Comment, include: [{ model: User, attributes: ['username'] }] },
      ],
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: req.params.postId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      post_id: req.params.postId,
      user_id: req.user.uid,
      content,
    });
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['username'] }],
    });
    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const [like, created] = await Like.findOrCreate({
      where: { post_id: req.params.postId, user_id: req.user.uid },
    });
    
    if (!created) {
      await like.destroy();
    }
    
    const likeCount = await Like.count({ where: { post_id: req.params.postId } });
    res.json({ likes: likeCount, isLiked: created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkLikeStatus = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { post_id: req.params.postId, user_id: req.user.uid },
    });
    res.json({ isLiked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getComments,
  addComment,
  likePost,
  checkLikeStatus,
};