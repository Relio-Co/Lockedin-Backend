const { User, FriendRequest } = require('../models');
const { Op } = require('sequelize');

const searchUsers = async (query, currentUserId) => {
  return User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: `%${query}%` } },
        { name: { [Op.iLike]: `%${query}%` } },
      ],
      user_id: { [Op.ne]: currentUserId },
    },
    attributes: ['user_id', 'username', 'name', 'profile_picture'],
    limit: 10,
  });
};

const sendFriendRequest = async (senderId, receiverId) => {
  const [request, created] = await FriendRequest.findOrCreate({
    where: { sender_id: senderId, receiver_id: receiverId },
    defaults: { status: 'pending' },
  });

  if (!created) {
    throw new Error('Friend request already exists');
  }

  return request;
};

const getFriendRequests = async (userId) => {
  return FriendRequest.findAll({
    where: { receiver_id: userId, status: 'pending' },
    include: [{ model: User, as: 'Sender', attributes: ['user_id', 'username', 'name', 'profile_picture'] }],
  });
};

const acceptFriendRequest = async (requestId, userId) => {
  const request = await FriendRequest.findOne({
    where: { request_id: requestId, receiver_id: userId, status: 'pending' },
  });

  if (!request) {
    throw new Error('Friend request not found');
  }

  await request.update({ status: 'accepted' });
  // Add to friends table (if you have one) or handle friendship logic here
};

const rejectFriendRequest = async (requestId, userId) => {
  const request = await FriendRequest.findOne({
    where: { request_id: requestId, receiver_id: userId, status: 'pending' },
  });

  if (!request) {
    throw new Error('Friend request not found');
  }

  await request.update({ status: 'rejected' });
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
};