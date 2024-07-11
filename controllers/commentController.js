const { Comment, User } = require('../models');

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.uid;

    const comment = await Comment.create({
      post_id: postId,
      user_id: userId,
      content,
    });

    const commentWithUser = await Comment.findByPk(comment.comment_id, {
      include: [{ model: User, attributes: ['username', 'profile_picture'] }],
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [{ model: User, attributes: ['username', 'profile_picture'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addComment, getComments };