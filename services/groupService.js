const { Group, GroupMember, User } = require('../models');

const getAllGroups = async () => {
  return Group.findAll();
};

const joinGroup = async (groupId, userId) => {
  const group = await Group.findByPk(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the user is already a member of the group
  const existingMember = await GroupMember.findOne({ where: { group_id: groupId, user_id: userId } });
  if (existingMember) {
    throw new Error('User is already a member of the group');
  }

  // Add user to the group
  await GroupMember.create({ group_id: groupId, user_id: userId, role: 'member' });

  // Get the updated number of members in the group
  const memberCount = await GroupMember.count({ where: { group_id: groupId } });

  return { groupId, memberCount };
};

module.exports = {
  getAllGroups,
  joinGroup,
};
