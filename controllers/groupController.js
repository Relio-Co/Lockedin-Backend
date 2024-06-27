const groupService = require('../services/groupService');
const db = require('../models');

const getAllGroups = async (req, res) => {
    try {
      const userId = req.user.uid; // Assuming user ID is available in req.user.uid
      const user = await db.User.findOne({ where: { username: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const groups = await groupService.getAllGroupsForUser(user.user_id);
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error getting groups:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const parsedGroupId = parseInt(groupId, 10);
    const userId = req.user.uid;

    if (isNaN(parsedGroupId)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const user = await db.User.findOne({ where: { username: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await groupService.joinGroup(parsedGroupId, user.user_id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGroups,
  joinGroup,
};
