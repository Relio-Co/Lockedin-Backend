const groupService = require('../services/groupService');

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
    const userId = req.user.uid; // Assuming user ID is available in req.user.uid

    const result = await groupService.joinGroup(groupId, userId);
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
