const { User, Friend, FriendRequest } = require('../models');
const { Op } = require('sequelize');

const searchUsers = async (query, currentUserId) => {
  return User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: `%${query}%` } },
        { name: { [Op.iLike]: `%${query}%` } },
      ],
      uuid: { [Op.ne]: currentUserId },
    },
    attributes: ['user_id', 'username', 'name', 'profile_picture', 'uuid'],
    limit: 10,
  });
};

const sendFriendRequest = async (senderUuid, receiverUuid) => {
  const sender = await User.findOne({ where: { uuid: senderUuid } });
  const receiver = await User.findOne({ where: { uuid: receiverUuid } });

  if (!receiver || !sender) {
    throw new Error('User not found');
  }

  const [request, created] = await FriendRequest.findOrCreate({
    where: { sender_id: sender.user_id, receiver_id: receiver.user_id },
    defaults: { status: 'pending' },
  });

  if (!created) {
    throw new Error('Friend request already exists');
  }

  return request;
};

const getFriendRequests = async (uuid) => {
  const user = await User.findOne({ where: { uuid } });

  if (!user) {
    throw new Error('User not found');
  }

  return FriendRequest.findAll({
    where: { receiver_id: user.user_id, status: 'pending' },
    include: [{ model: User, as: 'Sender', attributes: ['user_id', 'username', 'name', 'profile_picture'] }],
  });
};

const acceptFriendRequest = async (requestId, uuid) => {
  const user = await User.findOne({ where: { uuid } });

  if (!user) {
    throw new Error('User not found');
  }

  const request = await FriendRequest.findOne({
    where: { request_id: requestId, receiver_id: user.user_id, status: 'pending' },
  });

  if (!request) {
    throw new Error('Friend request not found');
  }

  await request.update({ status: 'accepted' });

  await Friend.create({ user_id: request.sender_id, friend_user_id: user.user_id });
  await Friend.create({ user_id: user.user_id, friend_user_id: request.sender_id });
};

const rejectFriendRequest = async (requestId, uuid) => {
  const user = await User.findOne({ where: { uuid } });

  if (!user) {
    throw new Error('User not found');
  }

  const request = await FriendRequest.findOne({
    where: { request_id: requestId, receiver_id: user.user_id, status: 'pending' },
  });

  if (!request) {
    throw new Error('Friend request not found');
  }

  await request.update({ status: 'rejected' });
};

const getFriends = async (uuid) => {
  const user = await User.findOne({ where: { uuid } });

  if (!user) {
    throw new Error('User not found');
  }

  const friends = await Friend.findAll({
    where: { user_id: user.user_id },
    include: [
      { model: User, as: 'UserFriend', attributes: ['user_id', 'username', 'name', 'profile_picture', 'uuid'] },
    ],
  });

  return friends.map(friend => friend.UserFriend);
};

const removeFriend = async (userUuid, friendId) => {
  const user = await User.findOne({ where: { uuid: userUuid } });

  if (!user) {
    throw new Error('User not found');
  }

  await Friend.destroy({ where: { user_id: user.user_id, friend_user_id: friendId } });
  await Friend.destroy({ where: { user_id: friendId, friend_user_id: user.user_id } });
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
};
