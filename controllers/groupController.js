// controllers/groupController.js
const { Group, GroupMember } = require('../models');

async function getAllGroups(req, res, next) {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (error) {
    next(error);
  }
}

async function joinGroup(req, res, next) {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.uid;
    await GroupMember.create({ group_id: groupId, user_id: userId, role: 'member' });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

async function getUserGroups(req, res, next) {
  try {
    const userId = req.user.uid;
    const groups = await GroupMember.findAll({ where: { user_id: userId } });
    res.json(groups);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllGroups,
  joinGroup,
  getUserGroups,
};
