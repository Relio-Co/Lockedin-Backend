const friendService = require('../services/friendService');

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.uid; // This is already a string
    const users = await friendService.searchUsers(query, currentUserId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.uid; // This is already a string
    const request = await friendService.sendFriendRequest(senderId, receiverId);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const username = req.user.uid; // This is already a string
    const requests = await friendService.getFriendRequests(username);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.uid; // This is already a string
    await friendService.acceptFriendRequest(requestId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.uid; // This is already a string
    await friendService.rejectFriendRequest(requestId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
};
