const { Group, GroupMember, User } = require('../models');

async function getAllGroups(req, res) {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          include: [
            {
              model: User,
              attributes: ['user_id', 'username', 'profile_picture'],
            },
          ],
        },
      ],
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getGroupsByUserId(req, res) {
  try {
    const userId = req.user.uid;
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          where: { user_id: userId },
          include: [
            {
              model: User,
              attributes: ['user_id', 'username', 'profile_picture'],
            },
          ],
        },
      ],
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function joinGroup(req, res) {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.uid;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await GroupMember.create({ group_id: groupId, user_id: userId, role: 'member' });
    res.status(200).json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllGroups,
  getGroupsByUserId,
  joinGroup,
};
