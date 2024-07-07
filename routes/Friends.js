const express = require('express');
const friendController = require('../controllers/friendController');

const router = express.Router();

router.get('/', friendController.getFriends);
router.get('/search', friendController.searchUsers);
router.post('/request', friendController.sendFriendRequest);
router.get('/requests', friendController.getFriendRequests);
router.post('/requests/:requestId/accept', friendController.acceptFriendRequest);
router.post('/requests/:requestId/reject', friendController.rejectFriendRequest);
router.delete('/:friendId', friendController.removeFriend);

module.exports = router;
