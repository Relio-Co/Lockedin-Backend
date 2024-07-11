const { Like, Post, User } = require('../models');

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;

    const [like, created] = await Like.findOrCreate({
      where: { post_id: postId, user_id: userId },
    });

    if (!created) {
      await like.destroy();
      res.json({ liked: false, likeCount: await Like.count({ where: { post_id: postId } }) });
    } else {
      res.json({ liked: true, likeCount: await Like.count({ where: { post_id: postId } }) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.findAll({
      where: { post_id: postId },
      include: [{ model: User, attributes: ['username', 'profile_picture'] }],
    });
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { likePost, getLikes };