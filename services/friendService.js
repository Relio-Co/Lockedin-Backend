const { User, FriendRequest, Friend } = require('../models');
const { Op } = require('sequelize');

const searchUsers = async (query, currentUserId) => {
  return User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: `%${query}%` } },
        { name: { [Op.iLike]: `%${query}%` } },
      ],
      username: { [Op.ne]: currentUserId }, // Ensure currentUserId is treated as a string
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

const getFriendRequests = async (username) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('User not found');
  }

  return FriendRequest.findAll({
    where: { receiver_id: user.user_id, status: 'pending' },
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

  // Add to friends table
  await Friend.create({ user_id: request.sender_id, friend_user_id: userId });
  await Friend.create({ user_id: userId, friend_user_id: request.sender_id });
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
