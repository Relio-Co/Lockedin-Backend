const { Group, GroupMember, User } = require('../models');

const getAllGroupsForUser = async (userId) => {
  const allGroups = await Group.findAll({
    include: [
      {
        model: GroupMember,
        as: 'GroupMembers',
        attributes: ['user_id'],
        where: { user_id: userId },
        required: false,
      },
    ],
  });

  return allGroups.map(group => ({
    ...group.toJSON(),
    subscribed: group.GroupMembers.length > 0,
  }));
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

  const existingMember = await GroupMember.findOne({ where: { group_id: groupId, user_id: userId } });
  if (existingMember) {
    await GroupMember.destroy({ where: { group_id: groupId, user_id: userId } });
    return { groupId, memberCount: await GroupMember.count({ where: { group_id: groupId } }), subscribed: false };
  } else {
    await GroupMember.create({ group_id: groupId, user_id: userId, role: 'member' });
    return { groupId, memberCount: await GroupMember.count({ where: { group_id: groupId } }), subscribed: true };
  }
};
const getSubscribedGroups = async (userId) => {
  const subscribedGroups = await Group.findAll({
    include: [
      {
        model: GroupMember,
        as: 'GroupMembers',
        where: { user_id: userId },
        required: true,
      },
    ],
  });
  return subscribedGroups;
};

module.exports = {
  getSubscribedGroups,
  getAllGroupsForUser,
  joinGroup,
};
