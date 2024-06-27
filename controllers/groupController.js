const groupService = require('../services/groupService');
const db = require('../models');

const getAllGroups = async (req, res) => {
  try {
    const userId = req.user.uid; // Assuming user ID is available in req.user.uid
    const user = await db.User.findOne({ where: { uuid: userId } });
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

const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.uid; // Assuming user ID is available in req.user.uid
    const user = await db.User.findOne({ where: { uuid: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const group = await db.Group.findByPk(groupId, {
      include: [
        {
          model: db.Post,
          as: 'Posts',
          required: false,
        },
        {
          model: db.GroupMember,
          as: 'GroupMembers',
          attributes: ['user_id'],
          where: { user_id: user.user_id },
          required: false,
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({
      ...group.toJSON(),
      posts: group.Posts || [],
      subscribed: group.GroupMembers.length > 0,
    });
  } catch (error) {
    console.error('Error getting group:', error);
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

    const user = await db.User.findOne({ where: { uuid: userId } });
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

const getSubscribedGroups = async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await db.User.findOne({ where: { uuid: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const subscribedGroups = await groupService.getSubscribedGroups(user.user_id);
    res.status(200).json(subscribedGroups);
  } catch (error) {
    console.error('Error getting subscribed groups:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSubscribedGroups,
  getAllGroups,
  joinGroup,
  getGroupById,
};
