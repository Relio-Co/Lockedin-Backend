const groupService = require('../services/groupService');
const db = require('../models'); // Add this line

const getAllGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error getting groups:', error);
    res.status(500).json({ error: error.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const parsedGroupId = parseInt(groupId, 10); // Ensure groupId is parsed as an integer
    const uid = req.user.uid; // Assuming user ID is available in req.user.uid

    if (isNaN(parsedGroupId)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const user = await db.User.findOne({ where: { username: uid } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user.user_id;

    const result = await groupService.joinGroup(parsedGroupId, userId);
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
