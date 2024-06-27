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
    const { receiverUuid } = req.body;
    const senderId = req.user.user_id; // Get the integer user_id
    const request = await friendService.sendFriendRequest(senderId, receiverUuid);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.user_id; // Get the integer user_id
    const requests = await friendService.getFriendRequests(userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.user_id; // Get the integer user_id
    await friendService.acceptFriendRequest(requestId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.user_id; // Get the integer user_id
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
