const friendService = require('../services/friendService');

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.uid;
    const users = await friendService.searchUsers(query, currentUserId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { receiverUuid } = req.body;
    const senderUuid = req.user.uid;
    const request = await friendService.sendFriendRequest(senderUuid, receiverUuid);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userUuid = req.user.uid;
    const requests = await friendService.getFriendRequests(userUuid);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userUuid = req.user.uid;
    await friendService.acceptFriendRequest(requestId, userUuid);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userUuid = req.user.uid;
    await friendService.rejectFriendRequest(requestId, userUuid);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const userUuid = req.user.uid;
    const friends = await friendService.getFriends(userUuid);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const userUuid = req.user.uid;
    const { friendId } = req.params;
    await friendService.removeFriend(userUuid, friendId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
